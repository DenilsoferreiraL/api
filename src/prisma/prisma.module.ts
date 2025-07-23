import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Torna o PrismaService disponível globalmente
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporta o PrismaService para que outros módulos possam injetá-lo
})
export class PrismaModule {}
