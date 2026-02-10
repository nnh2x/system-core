import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationStatus } from '../entities/organizations.entity';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Corporation' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'contact@acme.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+84987654321', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'https://acme.com', required: false })
  @IsUrl()
  @IsOptional()
  website?: string;
}

export class UpdateOrganizationDto {
  @ApiProperty({ example: 'Acme Corp', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'info@acme.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+84987654321', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'https://acme.com', required: false })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: 'https://logo.acme.com/logo.png', required: false })
  @IsUrl()
  @IsOptional()
  logo?: string;
}

export class UpdateOrganizationStatusDto {
  @ApiProperty({ enum: OrganizationStatus })
  @IsEnum(OrganizationStatus)
  @IsNotEmpty()
  status: OrganizationStatus;
}
