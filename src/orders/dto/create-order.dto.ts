import { Type } from "class-transformer";
import { IsArray, IsString, MinLength, ValidateNested } from "class-validator";
import { CreateOrderItemDto } from "./create-order-item.dto";

export class CreateOrderDto{
    @IsString({message:'O endereço deve ser uma string.'})
    @MinLength(10,{message:'O endereço deve ter no mínimo 10 caracteres.'})
    endereco:string

    @IsArray({message:'Os itens do pedido deve ser um array.'})
    @ValidateNested({each:true})
    @Type(()=>CreateOrderItemDto)
    itens: CreateOrderItemDto[]

    // O status inicial será PENDENTE, não permitiremos que o cliente defina o status inicial
    // @IsEnum(StatusPedido, { message: 'Status de pedido inválido.' })
    // @IsOptional()
    // status?: StatusPedido;
}