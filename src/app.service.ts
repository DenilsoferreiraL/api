import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private prisma: PrismaService) { }

  async onModuleInit() {
    // Este método é chamado uma vez quando o módulo é inicializado
    // É um bom lugar para testar a conexão com o DB
    try {
      // Tenta fazer uma consulta simples para verificar a conexão
      // Ex: Contar o número de usuários (ainda não temos usuários, mas a query funciona)
      const userCount = await this.prisma.usuario.count();
      console.log(
        `Conexão com o DB verificada. Atualmente, ${userCount} usuários no banco.`,
      );
    } catch (error) {
      console.error(
        'Falha na conexão com o banco de dados ou erro na consulta inicial:',
        error,
      );
    }

    // Habilita os shutdown hooks do Prisma para garantir desconexão limpa
    // Isso é especialmente importante em ambientes de produção
    // (Nota: app pode não estar disponível aqui, usaremos o main.ts para isso mais tarde)
  }

  getHello(): string {
    return 'Hello World from DevTech Store Backend!';
  }
}
