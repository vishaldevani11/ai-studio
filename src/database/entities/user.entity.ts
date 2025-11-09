import { Entity, Column, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
//import { Image } from './image.entity';
import { UserAddress } from './user-address.entity';
import { UserBusiness } from './user-business.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName: string;

  @Column({ name: 'email', unique: true, length: 150 })
  email: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @Column({ name: 'phone', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'profile_image', type: 'text', nullable: true })
  profileImage: string;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'phone_verified', default: false })
  phoneVerified: boolean;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'NOW()',
  })
  updatedAt: Date;

  @Column({ name: 'last_login', type: 'timestamp with time zone', nullable: true })
  lastLogin: Date;

  @Column({ name: 'referral_code', length: 50, nullable: true })
  referralCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  refreshToken?: string;

  @Column({ type: 'timestamp', nullable: true, select: false })
  refreshTokenExpires?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  passwordResetToken?: string;

  @Column({ type: 'timestamp', nullable: true, select: false })
  passwordResetExpires?: Date;

  @OneToMany(() => UserAddress, address => address.user, { cascade: true })
  addresses: UserAddress[];

  @OneToOne(() => UserBusiness, business => business.user)
  business: UserBusiness;
}
