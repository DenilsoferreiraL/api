// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module'; 
import { ConfigModule } from '@nestjs/config'; 
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}