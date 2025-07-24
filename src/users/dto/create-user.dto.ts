import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'O nome deve ser uma string.' })
    nome: string;

    @IsEmail({}, { message: 'Por favor, insira um email válido.' })
    email: string;

    @IsString({ message: 'A senha deve ser uma string.' })
    @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
    senha: string;

    @IsEnum(Role, { message: 'O role fornecido é inválido.' })
    role?: Role;
}
