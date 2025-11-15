import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ProductBackground } from './product-background.entity';
import { CreateProductBackgroundDto } from './dto/create-product-background.dto';
import { UpdateProductBackgroundDto } from './dto/update-product-background.dto';
import { ProductTheme } from '../product-themes/product-theme.entity';

@Injectable()
export class ProductBackgroundsService {
  constructor(
    @InjectRepository(ProductBackground)
    private readonly repo: Repository<ProductBackground>,
    @InjectRepository(ProductTheme)
    private readonly productThemeRepo: Repository<ProductTheme>,
  ) {}

  async create(dto: CreateProductBackgroundDto) {
    const productThemes = dto.productThemeIds
      ? await this.productThemeRepo.findByIds(dto.productThemeIds)
      : [];

    if (!dto.imageUrl) throw new BadRequestException('Image URL is required');

    const exists = await this.repo.findOne({ where: { name: dto.name, isDeleted: false } });
    if (exists) throw new BadRequestException('Product background with this name already exists');

    const entity = this.repo.create({ ...dto, productThemes });
    return this.repo.save(entity);
  }

  async findAll(search?: string, productThemeId?: string) {
    const where: any = { isDeleted: false };
    if (search) where.name = ILike(`%${search}%`);

    const qb = this.repo
      .createQueryBuilder('background')
      .leftJoinAndSelect('background.productThemes', 'productTheme')
      .where('background.is_deleted = false');

    if (search) qb.andWhere('background.name ILIKE :search', { search: `%${search}%` });
    if (productThemeId) qb.andWhere('productTheme.id = :productThemeId', { productThemeId });

    qb.orderBy('background.created_at', 'DESC');
    return qb.getMany();
  }

  async findOne(id: string) {
    const productBackground = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: ['productThemes'],
    });
    if (!productBackground) throw new NotFoundException('Product background not found');
    return productBackground;
  }

  async update(id: string, dto: UpdateProductBackgroundDto) {
    const productBackground = await this.findOne(id);
    if (dto.productThemeIds) {
      productBackground.productThemes = await this.productThemeRepo.findByIds(dto.productThemeIds);
    }
    Object.assign(productBackground, dto);
    return this.repo.save(productBackground);
  }

  async softDelete(id: string) {
    const productBackground = await this.findOne(id);
    productBackground.isDeleted = !productBackground.isDeleted;
    return this.repo.save(productBackground);
  }
}
