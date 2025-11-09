import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebAppController } from './webapp.controller';
import { WebAppService } from './webapp.service';
import { Industry } from '../admin/industries/industry.entity';
import { Category } from '../admin/categories/category.entity';
import { ProductType } from '../admin/product-types/product-type.entity';
import { ProductBackground } from '../admin/product-backgrounds/product-background.entity';
import { ProductTheme } from '../admin/product-themes/product-theme.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Industry, Category, ProductType, ProductTheme, ProductBackground]),
  ],
  controllers: [WebAppController],
  providers: [WebAppService],
})
export class WebAppModule {}
