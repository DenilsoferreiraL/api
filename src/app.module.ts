import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module'; // Importe o PrismaModule

@Module({
  imports: [PrismaModule], // Adicione o PrismaModule aqui
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
