// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module'; // Importe o AuthModule
import { ConfigModule } from '@nestjs/config'; // Importe ConfigModule
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis de ambiente acessíveis globalmente
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule, // Adicione o AuthModule aqui
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}