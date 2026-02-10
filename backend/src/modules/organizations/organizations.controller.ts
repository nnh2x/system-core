import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { PermissionsGuard } from '../../guards/permissions.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Roles } from '../../decorators/auth.decorator';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  UpdateOrganizationStatusDto,
} from '../../dtos/organization.dto';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create new organization (System Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
  })
  async create(
    @Body() createDto: CreateOrganizationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.organizationsService.create(createDto, userId);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all organizations with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    const skip = (page - 1) * pageSize;
    return this.organizationsService.findAll(skip, pageSize);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current user organization' })
  async getCurrentOrganization(
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.organizationsService.findOne(organizationId);
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get organization by ID' })
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Get('slug/:slug')
  @Roles('admin')
  @ApiOperation({ summary: 'Get organization by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.organizationsService.findBySlug(slug);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update organization' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateDto);
  }

  @Put(':id/status')
  @Roles('admin')
  @ApiOperation({ summary: 'Update organization status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateOrganizationStatusDto,
  ) {
    return this.organizationsService.updateStatus(id, statusDto);
  }

  @Get(':id/members')
  @Roles('admin')
  @ApiOperation({ summary: 'Get organization members' })
  async getMembers(@Param('id') id: string) {
    return this.organizationsService.getMembers(id);
  }

  @Get(':id/stats')
  @Roles('admin')
  @ApiOperation({ summary: 'Get organization statistics' })
  async getStats(@Param('id') id: string) {
    return this.organizationsService.getStats(id);
  }
}
