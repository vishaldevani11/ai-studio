import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { ProductType } from '../product-types/product-type.entity';
  import { ProductBackground } from '../product-backgrounds/product-background.entity';
  
  @Entity('product_themes')
  export class ProductTheme {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    name: string;
  
    @Column({ nullable: true, type: 'text' })
    description?: string;
  
    // Many-to-many with ProductTypes
    @ManyToMany(() => ProductType, (pt) => pt.productThemes)
    @JoinTable({
      name: 'product_type_themes',
      joinColumn: { name: 'theme_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'product_type_id', referencedColumnName: 'id' },
    })
    productTypes: ProductType[];
  
    // Many-to-many with BackgroundImages
    @ManyToMany(() => ProductBackground, (pb) => pb.productThemes, { cascade: true })
    @JoinTable({
      name: 'product_theme_backgrounds',
      joinColumn: { name: 'product_theme_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'product_background_id', referencedColumnName: 'id' },
    })
    productBackgrounds: ProductBackground[];
  
    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  