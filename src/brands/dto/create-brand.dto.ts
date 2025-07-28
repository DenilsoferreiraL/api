import { IsString, MinLength } from 'class-validator';

export class CreateBrandDto {
  @IsString({ message: 'O nome da marca deve ser uma string.' })
  @MinLength(2, { message: 'O nome da marca deve ter no mínimo 2 caracteres.' })
  nome: string;
}