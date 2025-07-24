// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Certifique-se de que PrismaModule está importado

@Module({
  imports: [PrismaModule], // UsersService precisa do PrismaService
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // <-- ADICIONE ESTA LINHA AQUI
})
export class UsersModule {}