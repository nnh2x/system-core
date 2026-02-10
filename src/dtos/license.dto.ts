import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlanType, BillingPeriod } from '../entities/subscription-plans.entity';
import { FeatureType } from '../entities/features.entity';

// Subscription Plans DTOs
export class CreateSubscriptionPlanDto {
  @ApiProperty({ example: 'Professional Plan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Full access to all features' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: PlanType })
  @IsEnum(PlanType)
  @IsNotEmpty()
  type: PlanType;

  @ApiProperty({ enum: BillingPeriod })
  @IsEnum(BillingPeriod)
  @IsNotEmpty()
  billingPeriod: BillingPeriod;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 14 })
  @IsNumber()
  @IsOptional()
  trialDays?: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  maxUsers?: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsOptional()
  maxProjects?: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @IsOptional()
  maxStorageGb?: number;
}

// Features DTOs
export class CreateFeatureDto {
  @ApiProperty({ example: 'api_access' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'API Access' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Access to REST API' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: FeatureType })
  @IsEnum(FeatureType)
  @IsNotEmpty()
  type: FeatureType;

  @ApiProperty({ example: 'true' })
  @IsString()
  @IsOptional()
  defaultValue?: string;

  @ApiProperty({ example: 'requests' })
  @IsString()
  @IsOptional()
  unit?: string;
}

// Plan Features DTOs
export class AssignFeatureToPlanDto {
  @ApiProperty({ example: 'uuid-of-plan' })
  @IsUUID()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ example: 'uuid-of-feature' })
  @IsUUID()
  @IsNotEmpty()
  featureId: string;

  @ApiProperty({ example: '10000' })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}

// Subscriptions DTOs
export class CreateSubscriptionDto {
  @ApiProperty({ example: 'uuid-of-organization' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ example: 'uuid-of-plan' })
  @IsUUID()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  autoRenew?: boolean;
}

// License Keys DTOs
export class CreateLicenseKeyDto {
  @ApiProperty({ example: 'uuid-of-subscription' })
  @IsUUID()
  @IsNotEmpty()
  subscriptionId: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsOptional()
  maxActivations?: number;
}
