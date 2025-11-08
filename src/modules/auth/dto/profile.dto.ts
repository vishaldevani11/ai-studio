import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';
import { BusinessDto } from './business.dto';
import { SubscriptionDto } from './subscription.dto';
import { UserStatus , UserRole } from '@/database/entities/user.entity';

export class ProfileDto {
  @ApiProperty({ description: "User's unique identifier" })
  @Expose()
  id: string;

  @ApiProperty({ description: "User's email address" })
  @Expose()
  email: string;

  @ApiProperty({ description: "User's first name" })
  @Expose()
  firstName: string;

  @ApiProperty({ description: "User's last name", required: false })
  @Expose()
  lastName?: string;

  @ApiProperty({ description: "User's phone number", required: false })
  @Expose()
  phone?: string;

  @ApiProperty({ enum: UserRole, description: "User's role" })
  @Expose()
  role: UserRole;

  @ApiProperty({ enum: UserStatus, description: "User's status" })
  @Expose()
  status: UserStatus;

  @ApiProperty({ description: 'Indicates if the email is verified' })
  @Expose()
  emailVerified: boolean;

  @ApiProperty({ description: 'Indicates if the phone is verified' })
  @Expose()
  phoneVerified: boolean;

  @ApiProperty({ description: 'Indicates if the user is subscribed to emails' })
  @Expose()
  emailSubscribed: boolean;

  @ApiProperty({ description: 'URL of the profile image', required: false })
  @Expose()
  profileImage?: string;

  @ApiProperty({ description: 'Last login timestamp', required: false })
  @Expose()
  lastLogin?: Date;

  @ApiProperty({ description: 'User referral code', required: false })
  @Expose()
  referralCode?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ type: () => [AddressDto], description: "User's addresses" })
  @Expose()
  @Type(() => AddressDto)
  addresses: AddressDto[];

  @ApiProperty({ type: () => BusinessDto, description: "User's business information", required: false })
  @Expose()
  @Type(() => BusinessDto)
  business?: BusinessDto;

  @ApiProperty({ type: () => [SubscriptionDto], description: "User's subscriptions" })
  @Expose()
  @Type(() => SubscriptionDto)
  subscriptions: SubscriptionDto[];
}
