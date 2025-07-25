// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita os shutdown hooks do Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app); // Garante que o método é chamado

  await app.listen(3000);
}
bootstrap();
