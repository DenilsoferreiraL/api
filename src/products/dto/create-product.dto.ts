import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Min, MinLength, ValidateNested } from "class-validator";

export class CreateProductImageDto{
    @IsUrl({},{message:' A URL da imagem deve ser um URL válido.'})
    url: string

    @IsInt({message:'A ordem da imagem deve ser um número inteiro.'})
    @Min(0,{message:'A ordem da imamgem não pode ser negativa.'})
    ordem?: number
}

export class CreateProductVariationDto{
    @IsString({message:'O SKU deve ser uma string.'})
    @MinLength(3,{message:'O SKU deve ter no mínimo 3 caracteres.'})
    sku: string

    @IsNumber({},{message:'O preço deve ser um número inteiro.'})
    @Min(0,{message:'O estoque não pode ser negativo.'})
    preco: number

    @IsInt({message:'O estoque deve ser um número inteiro.'})
    @Min(0,{message:'O estoque não pode ser negativo.'})
    estoque: number

    @IsString({message:'A cor deve ser uma string.'})
    @IsOptional()
    cor?: string

    @IsString({message: 'A capacidade deve ser uma string.'})
    @IsOptional()
    capacidade?: string

    @ValidateNested({each:true})
    @Type(() => CreateProductImageDto)
    @IsOptional()
    imagens?: CreateProductImageDto[]
}

export class CreateProductDto{
    @IsString({message:'O nome do produto deve ser uma string.'})
    @MinLength(3,{message:'O nome do produto deve ter no mínimo 3 caracteres.'})
    nome: string

    @IsString({message:'A descrição do produto deve ser uma string'})
    @MinLength(10,{message:'A descrição do produto deve ter no mínimo 10 caracteres.'})
    descricao: string

    @IsUUID('4', {message:'O ID da marca deve ser um UUID válido.'})
    marcaId: string

    @IsUUID('4', {message:'O ID da Categoria deve ser um UUID válido.'})
    categoriaId: string

    @ValidateNested({each:true})
    @Type(()=>CreateProductVariationDto)
    variacoes: CreateProductVariationDto[]
}