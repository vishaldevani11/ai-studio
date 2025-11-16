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

  @Column({ name: 'image_base64', type: 'text' })
  imageBase64: string; // required

  @ManyToOne(() => ProductType, pt => pt.productPoses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_type_id' })
  productType: ProductType;

  @Column({ name: 'product_type_id' })
  productTypeId: string;
}
