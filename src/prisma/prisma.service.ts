import {
    INestApplication,
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        // Conecta-se ao banco de dados quando o módulo é inicializado
        await this.$connect();
        console.log('PrismaService conectado ao banco de dados.');
    }

    async onModuleDestroy() {
        // Desconecta-se do banco de dados quando o módulo é destruído
        await this.$disconnect();
        console.log('PrismaService desconectado do banco de dados.');
    }

    // Método opcional para habilitar o "shutdown hooks"
    // Isso garante que o Prisma se desconecte mesmo se a aplicação for forçada a fechar
    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}
