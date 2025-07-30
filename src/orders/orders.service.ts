import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { StatusPedido, Role } from '@prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private productsService: ProductsService,
    ){}

     async create(userId: string, createOrderDto: CreateOrderDto) {
    const { endereco, itens } = createOrderDto;

    if (!itens || itens.length === 0) {
      throw new BadRequestException('O pedido deve conter pelo menos um item.');
    }

    let total = 0;
    const orderItemsData:any = [];

    //Validar produtos, variações e calcular o total
    for (const item of itens) {
      // Nota: Idealmente, você buscaria a variação específica (SKU)
      // Para simplificar, estamos buscando o Produto.
      // Se você implementou SKUs, buscaria a variação do produto pelo SKU e productId.
      const product = await this.productsService.findOne(item.productId); // Lança 404 se não encontrar

      // Para um e-commerce real, você precisaria buscar a variação específica
      // e verificar o estoque e preço daquela variação.
      // Por enquanto, vamos pegar o preço e estoque da primeira variação como exemplo.
      if (!product?.variacoes || product.variacoes.length === 0) {
        throw new BadRequestException(`Produto '${product?.nome}' não possui variações.`);
      }

      // Simplificando: vamos pegar a primeira variação para exemplo de preço/estoque
      // Em produção: você passaria o sku ou id da variacao no createOrderItemDto
      const primaryVariation = product.variacoes[0];

      if (primaryVariation.estoque < item.quantidade) {
        throw new BadRequestException(
          `Estoque insuficiente para o produto '${product.nome}' (SKU: ${primaryVariation.sku}). Disponível: ${primaryVariation.estoque}, Solicitado: ${item.quantidade}.`,
        );
      }

      const itemTotal = primaryVariation.preco.toNumber() * item.quantidade;
      total += itemTotal;

      orderItemsData.push({
        produtoId: product.id,
        // Usar o preco da variação no momento da compra
        precoUnitario: primaryVariation.preco,
        quantidade: item.quantidade,
      });
    }

    // 2. Criar o pedido e seus itens
    const newOrder = await this.prisma.$transaction(async (prisma) => {
      const order = await prisma.pedido.create({
        data: {
          usuario: { connect: { id: userId } },
          total: total,
          status: StatusPedido.PENDENTE, // Status inicial padrão
          endereco: endereco,
          itens: {
            createMany: {
              data: orderItemsData,
            },
          },
        },
        include: {
          itens: {
            include: {
              produto: true, // Inclui dados do produto nos itens
            },
          },
          usuario: {
            select: { id: true, nome: true, email: true } // Seleciona apenas alguns campos do usuário
          }
        },
      });

      // 3. Atualizar estoque (deve ser feito para a variação específica)
      for (const item of itens) {
        // Novamente, em um cenário real, você buscaria a variação por ID/SKU e atualizaria.
        // Aqui estamos simplificando, assumindo que a primeira variação representa o produto.
        const product = await prisma.produto.findUnique({
          where: { id: item.productId },
          include: { variacoes: true }
        });
        if (product && product.variacoes[0]) {
          await prisma.variacaoProduto.update({
            where: { id: product.variacoes[0].id },
            data: { estoque: { decrement: item.quantidade } },
          });
        }
      }
      return order;
    });

    return newOrder;
  }

  async findAll(role: Role, userId: string){
    const whereClause: any = {}

    if(role !== Role.ADMIN && userId){
      whereClause.usuarioId = userId
    }

    return this.prisma.pedido.findMany({
      where: whereClause,
      include:{
        usuario:{
          select:{id: true, nome: true, email:true}
        },
        itens:{
          include:{
            produto:true //Inclui o produto associado ao item do pedido
          }
        }
      },
      orderBy:{
        criadoEm:'desc' //Ordena os pedidos do mais recente para o mais antigo
      }
    })
  }

  async findOne(orderId: string, role: Role, userId?: string){
    const whereClause: any = {id: orderId}

    if(role !== Role.ADMIN && userId){
      whereClause.usuarioId = userId
    }

    const order = await this.prisma.pedido.findUnique({
      where: whereClause,
      include:{
        usuario:{
          select:{id: true, nome: true, email: true}
        }
      }
    })

    if(!order){
      throw new NotFoundException(`Pedido com ID '${orderId}' não encontrado`)
    }
    return order
  }

   async updateStatus(orderId: string, updateOrderDto: UpdateOrderDto, userRole: Role) { 
    // Apenas ADMIN pode atualizar o status do pedido
    if (userRole !== Role.ADMIN) { 
      throw new ForbiddenException('Apenas administradores podem atualizar o status de um pedido.');
    }

    await this.findOne(orderId, userRole);

    return this.prisma.pedido.update({
      where: { id: orderId },
      data: {
        status: updateOrderDto.status,
      },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true },
        },
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async remove(orderId: string, userRole: Role){

    if(userRole !== Role.ADMIN){
      throw new ForbiddenException('Apenas administradores podem remover um pedido.')
    }

    await this.findOne(orderId, userRole) //Verifica se o pedido existe

    return this.prisma.pedido.delete({
      where:{id: orderId}
    })
  }
}