import { IsOptional, IsEnum, IsBoolean, IsDateString, IsInt, IsString, Min, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  SubscriptionPlan,
  SubscriptionStatus,
} from '../../../database/entities/user-subscription.entity';

export class SubscriptionDto {
  @ApiPropertyOptional({
    description: 'Subscription plan',
    example: 'free',
    enum: SubscriptionPlan,
    default: 'free',
  })
  @IsOptional()
  @IsEnum(SubscriptionPlan, {
    message: 'Subscription plan must be one of: free, basic, pro, enterprise',
  })
  plan?: SubscriptionPlan;

  @ApiPropertyOptional({
    description: 'Subscription status',
    example: 'trial',
    enum: SubscriptionStatus,
    default: 'trial',
  })
  @IsOptional()
  @IsEnum(SubscriptionStatus, {
    message: 'Subscription status must be one of: trial, active, expired, canceled',
  })
  status?: SubscriptionStatus;

  @ApiPropertyOptional({
    description: 'Start date',
    example: '2023-01-01',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date string (YYYY-MM-DD)' })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date',
    example: '2023-12-31',
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date string (YYYY-MM-DD)' })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Auto renew subscription',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Auto renew must be a boolean' })
  autoRenew?: boolean;

  @ApiPropertyOptional({
    description: 'Payment method',
    example: 'credit_card',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Payment method must be a string' })
  @MaxLength(50, { message: 'Payment method must not exceed 50 characters' })
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Credits remaining',
    example: 0,
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Credits remaining must be an integer' })
  @Min(0, { message: 'Credits remaining cannot be negative' })
  creditsRemaining?: number;
}

