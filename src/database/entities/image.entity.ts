import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
//import { User } from './user.entity';

@Entity('images')
export class Image extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  prompt: string;

  @Column()
  filePath: string;

  @Column()
  fileName: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column({ nullable: true })
  metadata: string; // JSON string for additional metadata

  @Column({ default: false })
  isPublic: boolean;

  // @ManyToOne(() => User, (user) => user.images, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'userId' })
  // user: User;

  @Column()
  userId: string;
}
