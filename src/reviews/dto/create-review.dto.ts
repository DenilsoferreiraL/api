import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";

export class CreateReviewDto{
    @IsUUID('4',{message:'O ID do produto deve ser um UUID válido.'})
    productId: string;

    @IsInt({message:'A nota deve ser um número inteiro.'})
    @Min(1,{message:'A nota mínima é 1.'})
    @Max(5,{message:'A nota mínima é 5.'})
    nota:number

    @IsString({message:'O comentário deve ser uma string'})
    @MaxLength(500, {message:'O comentário não pode exceder 500 caracteres.'})
    @IsOptional()
    comentario?: string
}