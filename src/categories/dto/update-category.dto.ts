import { CreateCategoryDto } from "./create-category.dto";

export class UpdateCategoryDto extends CreateCategoryDto{
  //Adicionar validações específicas ou novas propriedades para update.
  // Exemplo:
  // @IsString({ message: 'O novo slug deve ser uma string.' })
  // @IsOptional()
  // novoSlug?: string;
}