import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Importe o PrismaService

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    // Este método será usado para criar um novo usuário no banco de dados
    // Por enquanto, apenas o esqueleto. Adicionaremos a lógica de criptografia de senha e DTOs depois.
    async create(data: any) {
        // Exemplo básico:
        return this.prisma.usuario.create({
            data: {
                ...data,
                // Role padrão para novos usuários
                role: 'CLIENTE',
            },
        });
    }

    // Este método será usado para buscar um usuário por email (útil para login)
    async findOneByEmail(email: string) {
        return this.prisma.usuario.findUnique({
            where: { email },
        });
    }

    // Este método será usado para buscar todos os usuários
    async findAll() {
        return this.prisma.usuario.findMany();
    }

    // Este método será usado para buscar um usuário por ID
    async findOneById(id: string) {
        return this.prisma.usuario.findUnique({
            where: { id },
        });
    }

    // Este método será usado para atualizar um usuário
    async update(id: string, data: any) {
        return this.prisma.usuario.update({
            where: { id },
            data,
        });
    }

    // Este método será usado para deletar um usuário
    async remove(id: string) {
        return this.prisma.usuario.delete({
            where: { id },
        });
    }
}
