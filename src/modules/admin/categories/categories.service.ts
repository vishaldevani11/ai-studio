import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Category } from '../../../database/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Industry } from '../../../database/entities/industry.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,

    @InjectRepository(Industry)
    private readonly industryRepo: Repository<Industry>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const industry = await this.industryRepo.findOne({
      where: { id: dto.industryId },
    });
    if (!industry) throw new NotFoundException('Industry not found');

    // Ensure category name uniqueness within the same industry
    const existing = await this.repo.findOne({
      where: { name: dto.name, industryId: dto.industryId },
    });
    if (existing) throw new BadRequestException('Category already exists in this industry');

    const entity = this.repo.create({ ...dto, industry });
    return this.repo.save(entity);
  }

  async findAll(industryId?: string, search?: string) {
    const where: any = {};

    if (industryId) where.industryId = industryId;
    if (search) where.name = ILike(`%${search}%`);

    return this.repo.find({
      where,
      relations: ['industry', 'productTypes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const category = await this.repo.findOne({
      where: { id },
      relations: ['industry', 'productTypes'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (dto.industryId) {
      const newIndustry = await this.industryRepo.findOne({
        where: { id: dto.industryId },
      });
      if (!newIndustry) throw new NotFoundException('New Industry not found');
      category.industry = newIndustry;
    }

    Object.assign(category, dto);
    return this.repo.save(category);
  }

  async softDelete(id: string) {
    const entity = await this.repo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    if (entity.deletedAt) {
      await this.repo.restore(id);
    } else {
      await this.repo.softDelete(id);
    }

    return this.repo.findOne({ where: { id } });
  }
}
