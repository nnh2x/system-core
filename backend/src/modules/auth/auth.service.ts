import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UsersEntity, UserStatus } from '../../entities/users.entity';
import {
  OrganizationsEntity,
  OrganizationStatus,
} from '../../entities/organizations.entity';
import { RolesEntity, RoleType } from '../../entities/roles.entity';
import { UserRolesEntity } from '../../entities/user-roles.entity';
import { LoginDto, RegisterDto } from '../../dtos/auth.dto';
import { JwtPayload, LoginResponse } from '../../interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(OrganizationsEntity)
    private organizationsRepository: Repository<OrganizationsEntity>,
    @InjectRepository(RolesEntity)
    private rolesRepository: Repository<RolesEntity>,
    @InjectRepository(UserRolesEntity)
    private userRolesRepository: Repository<UserRolesEntity>,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['organization'],
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async register(registerDto: RegisterDto): Promise<LoginResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    console.log("2331");

    try {
      // Check if user already exists
      const existingUser = await this.usersRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      // Create organization slug from name
      const slug = registerDto.organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Check if organization slug exists
      let finalSlug = slug;
      let counter = 1;
      while (
        await this.organizationsRepository.findOne({
          where: { slug: finalSlug },
        })
      ) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }

      // Create organization
      const organization = this.organizationsRepository.create({
        name: registerDto.organizationName,
        slug: finalSlug,
        email: registerDto.email,
        status: OrganizationStatus.TRIAL,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      });

      const savedOrganization = await queryRunner.manager.save(organization);

      // Create user
      const fullName = `${registerDto.firstName} ${registerDto.lastName}`;
      const code = `USR${Date.now()}`;

      const user = this.usersRepository.create({
        email: registerDto.email,
        password: registerDto.password, // Will be hashed by @BeforeInsert
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        fullName,
        code,
        phone: registerDto.phone,
        organizationId: savedOrganization.id,
        status: UserStatus.ACTIVE,
        emailVerified: false,
      });

      const savedUser = await queryRunner.manager.save(user);

      // Find or create default admin role for organization
      let adminRole = await this.rolesRepository.findOne({
        where: {
          name: 'admin',
          organizationId: savedOrganization.id,
        },
      });

      if (!adminRole) {
        adminRole = this.rolesRepository.create({
          name: 'admin',
          displayName: 'Administrator',
          description: 'Organization administrator with full access',
          type: RoleType.ORGANIZATION,
          organizationId: savedOrganization.id,
          isDefault: false,
        });
        adminRole = await queryRunner.manager.save(adminRole);
      }

      // Assign admin role to user
      const userRole = this.userRolesRepository.create({
        userId: savedUser.id,
        roleId: adminRole.id,
        grantedBy: savedUser.id,
      });

      await queryRunner.manager.save(userRole);

      await queryRunner.commitTransaction();

      // Generate tokens
      return this.login({
        email: savedUser.email,
        password: registerDto.password,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    if (user.organization.status === OrganizationStatus.SUSPENDED) {
      throw new UnauthorizedException('Organization is suspended');
    }

    // Load user roles
    const userWithRoles = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['userRoles', 'userRoles.role'],
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      organizationId: user.organizationId,
      roles: userWithRoles.userRoles?.map((ur) => ur.role.name) || [],
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Update last login
    await this.usersRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        organizationId: user.organizationId,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['organization', 'userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, twoFactorSecret, ...userProfile } = user;

    return {
      ...userProfile,
      roles:
        user.userRoles?.map((ur) => ({
          id: ur.role.id,
          name: ur.role.name,
          displayName: ur.role.displayName,
        })) || [],
    };
  }
}
