import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Industry } from '../admin/industries/industry.entity';
import { Category } from '../admin/categories/category.entity';
import { ProductType } from '../admin/product-types/product-type.entity';
import { ProductTheme } from '../admin/product-themes/product-theme.entity';
import { ProductBackground } from '../admin/product-backgrounds/product-background.entity';

@Injectable()
export class WebAppService {
  constructor(
    @InjectRepository(Industry)
    private readonly industryRepo: Repository<Industry>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(ProductType)
    private readonly productTypeRepo: Repository<ProductType>,

    @InjectRepository(ProductTheme)
    private readonly productThemeRepo: Repository<ProductTheme>,

    @InjectRepository(ProductBackground)
    private readonly productBackgroundRepo: Repository<ProductBackground>,
  ) {}

  /**
   * Fetch the full hierarchy of:
   * Industry → Categories → Product Types → Product Themes → Product Backgrounds
   */
  async getIndustriesTree() {
    const industries = await this.industryRepo.find({
      where: { isDeleted: false },
      relations: [
        'categories',
        'categories.productTypes',
        'categories.productTypes.productThemes',
        'categories.productTypes.productThemes.productBackgrounds',
      ],
      order: {
        name: 'ASC',
        categories: { name: 'ASC' },
      },
    });

    // Build clean nested JSON for the public webapp
    return industries.map((industry) => ({
      id: industry.id,
      name: industry.name,
      description: industry.description,
      categories: industry.categories
        ?.filter((cat) => !cat.isDeleted)
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          productTypes: cat.productTypes
            ?.filter((pt) => !pt.isDeleted)
            .map((pt) => ({
              id: pt.id,
              name: pt.name,
              description: pt.description,
              productThemes: pt.productThemes
                ?.filter((theme) => !theme.isDeleted)
                .map((theme) => ({
                  id: theme.id,
                  name: theme.name,
                  description: theme.description,
                  productBackgrounds: theme.productBackgrounds
                    ?.filter((pb) => !pb.isDeleted)
                    .map((pb) => ({
                      id: pb.id,
                      name: pb.name,
                      description: pb.description,
                      imageUrl: pb.imageUrl,
                    })),
                })),
            })),
        })),
    }));
  }
}
