// src/app.service.ts
import { Injectable } from '@nestjs/common'; // Removemos OnModuleInit

// Não precisamos mais injetar o PrismaService aqui para este teste simples
// import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  // Removemos o construtor que injetava PrismaService
  // constructor(private prisma: PrismaService) {}

  // Removemos o método onModuleInit completamente
  // async onModuleInit() {
  //   try {
  //     const userCount = await this.prisma.usuario.count();
  //     console.log(`Conexão com o DB verificada. Atualmente, ${userCount} usuários no banco.`);
  //   } catch (error) {
  //     console.error('Falha na conexão com o banco de dados ou erro na consulta inicial:', error);
  //   }
  // }

  getHello(): string {
    return 'Hello World from DevTech Store Backend!';
  }
}
