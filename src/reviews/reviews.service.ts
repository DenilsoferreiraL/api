import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ReviewsService {
    constructor(
        private prisma: PrismaService,
        private productsService:ProductsService
    ){}

    async create(userId: string, createReviewDto: CreateReviewDto){
        const { productId, nota, comentario}  = createReviewDto
        //Verificar se o produto existe
        await this.productsService.findOne(productId)

        const  existingReview = await this.prisma.avaliacao.findFirst({
            where:{
                usuarioId: userId,
                produtoId: productId
            }
        })

        if(existingReview){
            throw new BadRequestException('Você já avaliou este produto, Considere atualizar sua avaliação existente.')
        }

        const review = await this.prisma.avaliacao.create({
            data:{
                usuarioId: userId,
                produtoId: productId,
                nota: nota,
                comentario: comentario
            },
            include:{
                usuario:{
                    select: {id:true, nome: true, email: true}
                },
                produto:{
                select:{id: true, nome:true, slug: true}
                }
            }
        })
        return review
    }

    async findAll(productId?: string){
        const whereClause: any = {}
        if(productId){
            whereClause.productId = productId
        }

        return this.prisma.avaliacao.findMany({
            where:whereClause,
            include:{
                usuario:{
                    select:{id:true, nome:true, email:true}
                },
                produto:{
                    select:{id:true, nome: true, slug:true}
                }
            },
            orderBy:{
                criadoEm: 'desc'
            }
        })
    }

    async findOne(id:string){
        const review = await this.prisma.avaliacao.findUnique({
            where: {id},
            include:{
                usuario:{
                    select:{id:true, nome:true, email:true}
                },
                produto:{
                    select:{id:true, nome:true, slug:true}
                }
            }
        })

        if(!review){
            throw new NotFoundException(`Avaliação com ID '${id} não encontrado.'`)
        }
        return review
    }

    async update(id: string, userId:string, updateReviewDto: UpdateReviewDto){
        const review = await this.findOne(id)

        if(review.usuarioId !== userId){
            throw new ForbiddenException('Você não tem permissão para atualizar esta avaliação.')
        }

        return this.prisma.avaliacao.update({
            where:{id},
            data: updateReviewDto,
            include:{
                usuario:{
                    select:{id: true, nome: true, email:true}
                },
                produto:{
                     select:{id: true, nome: true, slug:true}
                }
            }
        })
    }

    async remove(id:string, userId: string, userRole: Role){
         const review = await this.findOne(id);

        if(review.usuarioId !== userId && userRole !== Role.ADMIN){
            throw new ForbiddenException('Você não tem permissão para remover esta avaliação.')
        }

        await this.prisma.avaliacao.delete({
            where:{id}
        })
        return {message: 'Avaliação removida com sucesso.'}

    }

}
