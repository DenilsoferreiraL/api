import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module'; 
import { CategoriesModule } from '../categories/categories.module'; 
import { BrandsModule } from '../brands/brands.module'; 

@Module({
  imports: [
    PrismaModule,      
    CategoriesModule,  
    BrandsModule,      
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}