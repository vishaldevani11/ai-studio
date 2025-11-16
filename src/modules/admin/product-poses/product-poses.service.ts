import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ProductPose } from '../../../database/entities/product-pose.entity';
import { CreateProductPoseDto } from './dto/create-product-pose.dto';
import { UpdateProductPoseDto } from './dto/update-product-pose.dto';
import { ProductType } from '../../../database/entities/product-type.entity';

@Injectable()
export class ProductPosesService {
  constructor(
    @InjectRepository(ProductPose)
    private readonly repo: Repository<ProductPose>,
    @InjectRepository(ProductType)
    private readonly productTypeRepo: Repository<ProductType>,
  ) {}

  async create(dto: CreateProductPoseDto) {
    const productType = await this.productTypeRepo.findOne({
      where: { id: dto.productTypeId },
    });
    if (!productType) throw new NotFoundException('Product type not found');

    if (!dto.imageBase64) throw new BadRequestException('Base64 image is required');

    const exists = await this.repo.findOne({
      where: { name: dto.name, productTypeId: dto.productTypeId },
    });
    if (exists) throw new BadRequestException('Product pose already exists for this product type');

    const entity = this.repo.create({
      ...dto,
      imageBase64: dto.imageBase64,
      productType,
    });

    return this.repo.save(entity);
  }

  async findAll(productTypeId?: string, search?: string) {
    const where: any = {};
    if (productTypeId) where.productTypeId = productTypeId;
    if (search) where.name = ILike(`%${search}%`);

    return this.repo.find({
      where,
      relations: ['productType', 'productType.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const pose = await this.repo.findOne({
      where: { id },
      relations: ['productType', 'productType.category'],
    });
    if (!pose) throw new NotFoundException('Product pose not found');
    return pose;
  }

  async update(id: string, dto: UpdateProductPoseDto) {
    const pose = await this.findOne(id);

    if (dto.productTypeId) {
      const newPt = await this.productTypeRepo.findOne({
        where: { id: dto.productTypeId },
      });
      if (!newPt) throw new NotFoundException('New product type not found');
      pose.productType = newPt;
      pose.productTypeId = dto.productTypeId;
    }

    if (dto.name) {
      const duplicate = await this.repo.findOne({
        where: {
          name: dto.name,
          productTypeId: pose.productTypeId,
        },
      });
      if (duplicate && duplicate.id !== pose.id) {
        throw new BadRequestException('Product pose already exists for this product type');
      }
    }
    pose.name = dto.name ?? pose.name;
    pose.description = dto.description ?? pose.description;
    if (dto.imageBase64) {
      pose.imageBase64 = dto.imageBase64;
    }
    return this.repo.save(pose);
  }

  async softDelete(id: string) {
    // Load the pose including soft-deleted ones
    const pose = await this.repo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!pose) {
      throw new NotFoundException('Product pose not found');
    }

    // Toggle delete/restore
    if (pose.deletedAt) {
      await this.repo.restore(id);
    } else {
      await this.repo.softDelete(id);
    }

    // Return updated entity (same behavior as before)
    return this.repo.findOne({ where: { id } });
  }
}
