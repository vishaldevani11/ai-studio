import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ProductTheme } from './product-theme.entity';
import { CreateProductThemeDto } from './dto/create-product-theme.dto';
import { UpdateProductThemeDto } from './dto/update-product-theme.dto';
import { ProductType } from '../product-types/product-type.entity';

@Injectable()
export class ProductThemesService {
  constructor(
    @InjectRepository(ProductTheme)
    private readonly repo: Repository<ProductTheme>,
    @InjectRepository(ProductType)
    private readonly productTypeRepo: Repository<ProductType>,
  ) {}

  async create(dto: CreateProductThemeDto) {
    const productTypes = dto.productTypeIds
      ? await this.productTypeRepo.findByIds(dto.productTypeIds)
      : [];

    const productTheme = this.repo.create({ ...dto, productTypes });
    return this.repo.save(productTheme);
  }

  async findAll(search?: string) {
    const where: any = { isDeleted: false };
    if (search) where.name = ILike(`%${search}%`);

    return this.repo.find({
      where,
      relations: ['productTypes', 'productBackgrounds'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const productTheme = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: ['productTypes', 'productBackgrounds'],
    });
    if (!productTheme) throw new NotFoundException('Product theme not found');
    return productTheme;
  }

  async update(id: string, dto: UpdateProductThemeDto) {
    const productTheme = await this.findOne(id);
    if (dto.productTypeIds) {
      productTheme.productTypes = await this.productTypeRepo.findByIds(dto.productTypeIds);
    }
    Object.assign(productTheme, dto);
    return this.repo.save(productTheme);
  }

  async softDelete(id: string) {
    const productTheme = await this.findOne(id);
    productTheme.isDeleted = true;
    return this.repo.save(productTheme);
  }
}
