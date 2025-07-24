import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Este email já está em uso.'); 
    }

    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);

    // Esta linha garantirá que, se role não for fornecido no DTO, ele será CLIENTE
    const role = createUserDto.role || Role.CLIENTE;

    return this.prisma.usuario.create({
      data: {
        nome: createUserDto.nome,
        email: createUserDto.email,
        senha: hashedPassword,
        role: role,
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany();
  }

  async findOneById(id: string) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}
