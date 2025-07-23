// src/prisma/prisma.service.ts
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
    constructor() {
        super(); // Chama o construtor da classe pai (PrismaClient)
    }

    async onModuleInit() {
        await this.$connect();
        console.log('PrismaService conectado ao banco de dados.');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('PrismaService desconectado do banco de dados.');
    }

    // Novo método para ativar os shutdown hooks, a ser chamado em main.ts
    async enableShutdownHooks(app: INestApplication) {
        // Registra um hook para o evento 'beforeExit' do Node.js
        // Isso garante que o NestJS desligue graciosamente o PrismaClient antes de encerrar
        process.on('beforeExit', async () => {
            await app.close(); // Fecha a aplicação NestJS, o que acionará o onModuleDestroy do PrismaService
        });
    }
}
