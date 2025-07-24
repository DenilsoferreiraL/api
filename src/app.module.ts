import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module'; // Importe o UsersModule

@Module({
  imports: [PrismaModule, UsersModule], // Adicione o UsersModule aqui
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
