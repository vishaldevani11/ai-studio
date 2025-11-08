import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Industry } from './industry.entity';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';

@Injectable()
export class IndustriesService {
  constructor(
    @InjectRepository(Industry)
    private readonly repo: Repository<Industry>,
  ) {}

  async findAll(search?: string) {
    const where = search
      ? { name: ILike(`%${search}%`), isDeleted: false }
      : { isDeleted: false };

    return this.repo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const industry = await this.repo.findOne({ where: { id, isDeleted: false } });
    if (!industry) throw new NotFoundException('Industry not found');
    return industry;
  }

  async create(dto: CreateIndustryDto) {
    const industry = this.repo.create(dto);
    return this.repo.save(industry);
  }

  async update(id: string, dto: UpdateIndustryDto) {
    const industry = await this.findOne(id);
    Object.assign(industry, dto);
    return this.repo.save(industry);
  }

  async softDelete(id: string) {
    const industry = await this.findOne(id);
    industry.isDeleted = true;
    return this.repo.save(industry);
  }
}
