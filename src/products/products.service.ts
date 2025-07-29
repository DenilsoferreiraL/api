import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BrandsService } from 'src/brands/brands.service';
import { CategoriesService } from 'src/categories/categories.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import slugify from 'slugify';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        private categoriesService: CategoriesService,
        private brandsService: BrandsService
    ){}

    async create(createProductDto: CreateProductDto){
        const {nome, descricao, marcaId, categoriaId, variacoes} = createProductDto
        //Valida se a marca e a categoria existem
        await this.brandsService.findOne(marcaId)
        await this.categoriesService.findOne(categoriaId)
        //Gerar slug do produto e verificar duplicidade
        const productSlug = slugify(nome,{lower: true, strict: true})
        const existingProduct = await this.prisma.produto.findFirst({
            where:{nome: nome}
        })

        if(existingProduct){
            throw new ConflictException(`Produto com o nome '${nome}' já existe.`)
        }
        //Verifica Skus duplicados dentro das variações fornecidas
        const skus = variacoes.map(v => v.sku)
        const uniqueSkus = new Set(skus)
        
        if(uniqueSkus.size !== skus.length){
            throw new ConflictException('Existem SKUs duplicados nas variacoes fornecidas.')
        }

        //Verifica se algum SKU já existe no banco de dados
        const existingVariations = await this.prisma.variacaoProduto.findMany({
            where:{
             sku:{
                in:skus
             }
            }
        })

        if(existingVariations.length > 0 ){
            const duplicatedSkus = existingVariations.map(v => v.sku)
            throw new ConflictException(`O Skus [${duplicatedSkus.join(', ')}] já estão em uso.`)
        }

        //Preparar dados para criação aninhada
        const variationsData = variacoes.map(v => ({
            sku: v.sku,
            preco: v.preco,
            estoque: v.estoque,
            cor: v.cor,
            capacidade: v.capacidade,
            imagens:{
                create: v.imagens?.map(img => ({
                    url: img.url,
                    ordem: img.ordem || 0
                }))
            }
        }))

        //Criar o produto e suas variações/imagens
        const newProduct = await this.prisma.produto.create({
            data:{
                nome,
                descricao,
                slug: productSlug,
                marca:{connect:{id:marcaId}},
                categoria:{connect :{id: categoriaId}},
                variacoes:{
                    create: variationsData,
                }
            },
        //Incluindo relações no retorno para facilitar a visualização
        include:{
            marca:true,
            categoria: true,
            variacoes:{
                include:{
                    imagens: true
                }
            }
        }
        })
        return newProduct
    }

    async findAll(){
        return this.prisma.produto.findMany({
            include:{
                marca: true,
                categoria:true,
                variacoes:{
                    include:{
                        imagens: true
                    }
                }
            }
        })
    }

    async findOne(id: string){
        const product = this.prisma.produto.findUnique({
            where:{id},
            include:{
                marca: true,
                categoria:true,
                variacoes:{
                    include:{
                        imagens: true
                    }
                }
            }
        })

        if(!product){
            throw new NotFoundException(`Produto com ID '${id}' não encontrado.`)
        }
        return product
    }

    async update(id: string, updateProductDto: UpdateProductDto){
        //Buscar o produto primeiro.
        await this.findOne(id)//lança o NotFoundException se não existir.

        const {nome, marcaId, categoriaId} = updateProductDto
        let productSlug: string | undefined

        if(nome){
            productSlug = slugify(nome, {lower: true, strict:true})

            const existingProduct = await this.prisma.produto.findFirst({
                where:{nome: nome, NOT: {id: id}}
            })
            if(existingProduct){
                throw new ConflictException(`Produto com o nome '${nome}' já existe.`)
            }
        }
        //Validando se a nova marca e categoria(se fornecidas) existem.
        if(marcaId){
            await this.brandsService.findOne(marcaId)
        }
        if(categoriaId){
            await this.categoriesService.findOne(categoriaId)
        }

        return this.prisma.produto.update({
            where:{id},
            data:{
                nome,
                descricao: updateProductDto.descricao,
                slug: productSlug,
                marca: marcaId ? {connect: {id: categoriaId}} : undefined,
                categoria: categoriaId ? {connect : {id: categoriaId}} : undefined,
            },
            include:{
                marca:true,
                categoria:true,
                variacoes:{
                    include:{
                        imagens:true
                    }
                }
            }
        })
    }

    async remove(id: string){
    //Busncando o produto primeiro, caso não encontre lança o erro 404.
        await this.findOne(id)

        try{
            return await this.prisma.produto.delete({
                where: {id}
            })
        }catch(error){
            throw error
        }
    }
}