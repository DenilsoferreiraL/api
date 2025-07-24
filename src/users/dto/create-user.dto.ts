import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { Role } from '@prisma/client'; 

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  nome: string;

  @IsEmail({}, { message: 'Por favor, forneça um email válido.' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  senha: string;

  @IsEnum(Role, { message: 'O role fornecido é inválido.' })
  
  role?: Role;
}