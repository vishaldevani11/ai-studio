import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { ProductTheme } from '../product-themes/product-theme.entity';
@Entity('product_types')
export class ProductType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ManyToOne(() => Category, category => category.productTypes, { onDelete: 'CASCADE' })
  category: Category;

  @ManyToMany(() => ProductTheme, pt => pt.productTypes)
  productThemes: ProductTheme[];

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
