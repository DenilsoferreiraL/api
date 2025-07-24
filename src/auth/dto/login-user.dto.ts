// src/auth/dto/login-user.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Por favor, forneça um email válido.' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  senha: string;
}