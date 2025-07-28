import { IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
  @IsString({ message: 'O nome da categoria deve ser uma string.' })
  @MinLength(3, { message: 'O nome da categoria deve ter no mínimo 3 caracteres.' })
  nome: string;
}