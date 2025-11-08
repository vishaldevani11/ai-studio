import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('user_addresses')
export class UserAddress extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'address_type', length: 50, default: 'default' })
  addressType: string;

  @Column({ name: 'street', length: 255, nullable: true })
  street: string;

  @Column({ name: 'city', length: 100, nullable: true })
  city: string;

  @Column({ name: 'state', length: 100, nullable: true })
  state: string;

  @Column({ name: 'zipcode', length: 20, nullable: true })
  zipcode: string;

  @Column({ name: 'country', length: 100, default: 'India' })
  country: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'NOW()' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

