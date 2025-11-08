import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Industry } from './industries/industry.entity';
import { Category } from './categories/category.entity';
import { ProductType } from './product-types/product-type.entity';
import { IndustriesService } from './industries/industries.service';
import { CategoriesService } from './categories/categories.service';
import { ProductTypesService } from './product-types/product-types.service';
import { IndustriesController } from './industries/industries.controller';
import { CategoriesController } from './categories/categories.controller';
import { ProductTypesController } from './product-types/product-types.controller';
import { ProductPose } from './product-poses/product-pose.entity';
import { ProductPosesController } from './product-poses/product-poses.controller';
import { ProductPosesService } from './product-poses/product-poses.service';
import { ProductTheme } from './product-themes/product-theme.entity';
import { ProductThemesController } from './product-themes/product-themes.controller';
import { ProductThemesService } from './product-themes/product-themes.service';
import { ProductBackground } from './product-backgrounds/product-background.entity';
import { ProductBackgroundsController } from './product-backgrounds/product-backgrounds.controller';
import { ProductBackgroundsService } from './product-backgrounds/product-backgrounds.service';

@Module({
  imports: [TypeOrmModule.forFeature([Industry, Category, ProductType, ProductPose, ProductTheme, ProductBackground])],
  controllers: [IndustriesController, CategoriesController, ProductTypesController, ProductPosesController, ProductThemesController, ProductBackgroundsController],
  providers: [IndustriesService, CategoriesService, ProductTypesService, ProductPosesService, ProductThemesService, ProductBackgroundsService],
})
export class AdminModule {}
