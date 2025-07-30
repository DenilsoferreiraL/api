import { PartialType } from "@nestjs/mapped-types";
import { IsInt, IsString, Max, MaxLength, Min } from "class-validator";
import { CreateReviewDto } from "./create-review.dto";

export class UpdateReviewDto extends PartialType(CreateReviewDto){

        @IsInt({message:'A nota deve ser um número inteiro.'})
        @Min(1,{message:'A nota mínima é 1.'})
        @Max(5,{message:'A nota mínima é 5.'})
        nota?:number
    
        @IsString({message:'O comentário deve ser uma string'})
        @MaxLength(500, {message:'O comentário não pode exceder 500 caracteres.'})
        comentario?: string
        
}