import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationsEntity } from '../../entities/organizations.entity';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  UpdateOrganizationStatusDto,
} from '../../dtos/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(OrganizationsEntity)
    private organizationsRepository: Repository<OrganizationsEntity>,
  ) {}

  async create(createDto: CreateOrganizationDto, createdBy: string) {
    // Create slug from name
    const slug = createDto.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug exists
    let finalSlug = slug;
    let counter = 1;
    while (
      await this.organizationsRepository.findOne({ where: { slug: finalSlug } })
    ) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const organization = this.organizationsRepository.create({
      ...createDto,
      slug: finalSlug,
      createdBy,
    });

    return this.organizationsRepository.save(organization);
  }

  async findAll(skip: number = 0, take: number = 10) {
    const [organizations, total] =
      await this.organizationsRepository.findAndCount({
        skip,
        take,
        order: { createdAt: 'DESC' },
      });

    return {
      data: organizations,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async findOne(id: string) {
    const organization = await this.organizationsRepository.findOne({
      where: { id },
      relations: ['users', 'subscriptions'],
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async findBySlug(slug: string) {
    const organization = await this.organizationsRepository.findOne({
      where: { slug },
      relations: ['users', 'subscriptions'],
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async update(id: string, updateDto: UpdateOrganizationDto) {
    const organization = await this.findOne(id);

    Object.assign(organization, updateDto);

    return this.organizationsRepository.save(organization);
  }

  async updateStatus(id: string, statusDto: UpdateOrganizationStatusDto) {
    const organization = await this.findOne(id);

    organization.status = statusDto.status;

    return this.organizationsRepository.save(organization);
  }

  async getMembers(organizationId: string) {
    const organization = await this.organizationsRepository.findOne({
      where: { id: organizationId },
      relations: ['users', 'users.userRoles', 'users.userRoles.role'],
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization.users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      roles:
        user.userRoles?.map((ur) => ({
          id: ur.role.id,
          name: ur.role.name,
          displayName: ur.role.displayName,
        })) || [],
    }));
  }

  async getStats(organizationId: string) {
    const organization = await this.organizationsRepository.findOne({
      where: { id: organizationId },
      relations: ['users', 'subscriptions'],
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const activeUsers = organization.users.filter(
      (u) => u.status === 'active',
    ).length;
    const activeSubscription = organization.subscriptions?.find(
      (s) => s.status === 'active',
    );

    return {
      totalUsers: organization.users.length,
      activeUsers,
      status: organization.status,
      trialEndsAt: organization.trialEndsAt,
      subscription: activeSubscription
        ? {
            id: activeSubscription.id,
            status: activeSubscription.status,
            expiresAt: activeSubscription.expiresAt,
          }
        : null,
    };
  }
}
