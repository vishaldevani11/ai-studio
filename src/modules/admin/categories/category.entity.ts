import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    OneToMany, 
    CreateDateColumn, 
    UpdateDateColumn, 
    Index 
  } from 'typeorm';
  import { Industry } from '../industries/industry.entity';
  import { ProductType } from '../product-types/product-type.entity';
  
  @Entity('categories')
  export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Index()
    @Column()
    name: string;
  
    @Column({ nullable: true, type: 'text' })
    description?: string;
  
    @ManyToOne(() => Industry, (industry) => industry.categories, { onDelete: 'CASCADE' })
    industry: Industry;
  
    @Column({ name: 'industry_id' })
    industryId: string;
  
    @OneToMany(() => ProductType, (pt) => pt.category, { cascade: true })
    productTypes: ProductType[];
  
    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  