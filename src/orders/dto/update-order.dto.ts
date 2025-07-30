import { PartialType } from "@nestjs/mapped-types";
import { CreateOrderDto } from "./create-order.dto";
import { IsEnum, IsOptional } from "class-validator";
import { StatusPedido } from "@prisma/client";

export class UpdateOrderDto extends PartialType(CreateOrderDto){
    @IsEnum(StatusPedido,{message:'Status de pedido inválido.'})
    @IsOptional()
    status?: StatusPedido
}