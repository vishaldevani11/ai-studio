import { Entity, Column, ManyToOne, Index, JoinColumn } from 'typeorm';
import { ProductType } from './product-type.entity';
import { BaseEntity } from './base.entity';

@Entity('product_poses')
export class ProductPose extends BaseEntity {
  @Index()
  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ name: 'image_base64', type: 'text', nullable: true })
  imageBase64?: string; // Deprecated - kept for backward compatibility

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl?: string; // CDN URL from GCS

  @ManyToOne(() => ProductType, pt => pt.productPoses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_type_id' })
  productType: ProductType;

  @Column({ name: 'product_type_id' })
  productTypeId: string;
}
