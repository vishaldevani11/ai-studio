import { Entity, Column, ManyToMany, Index } from 'typeorm';
import { ProductTheme } from './product-theme.entity';
import { BaseEntity } from './base.entity';

@Entity('product_backgrounds')
export class ProductBackground extends BaseEntity {
  @Index()
  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ name: 'image_base64', type: 'text' })
  imageBase64: string;

  @ManyToMany(() => ProductTheme, pt => pt.productBackgrounds)
  productThemes: ProductTheme[];
}
