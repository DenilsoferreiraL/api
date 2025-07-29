import { IsInt, IsUUID, Min } from "class-validator";

export class CreateOrderItemDto {
    @IsUUID(4,{message:'O ID do produto deve ser um UUID válido.'})
    productId: string

    @IsInt({message: 'A quantidade deve ser um número inteiro.'})
    @Min(1,{message:'A quantidade mínima é 1.'})
    quantidade: number

    // precoUnitario não será enviado pelo cliente, será buscado no backend
    // @IsNumber({}, { message: 'O preço unitário deve ser um número.' })
    // @Min(0, { message: 'O preço unitário não pode ser negativo.' })
    // precoUnitario: number;
}