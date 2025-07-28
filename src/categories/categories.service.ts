
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import slugify from 'slugify'; 

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { nome } = createCategoryDto;
    const slug = slugify(nome, { lower: true, strict: true }); 

    
    const existingCategory = await this.prisma.categoria.findFirst({
      where: {
        OR: [{ nome: nome }, { slug: slug }],
      },
    });

    if (existingCategory) {
      if (existingCategory.nome === nome) {
        throw new ConflictException(`Categoria com o nome '${nome}' já existe.`);
      }
      if (existingCategory.slug === slug) {
        throw new ConflictException(`Categoria com o slug '${slug}' já existe.`);
      }
    }

    
    return this.prisma.categoria.create({
      data: {
        nome,
        slug,
      },
    });
  }

  async findAll() {
    return this.prisma.categoria.findMany();
  }

  async findOne(id: string) {
    const category = await this.prisma.categoria.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Categoria com ID '${id}' não encontrada.`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { nome } = updateCategoryDto;
    let slug: string | undefined;

    if (nome) {
      slug = slugify(nome, { lower: true, strict: true });

      
      const existingCategory = await this.prisma.categoria.findFirst({
        where: {
          OR: [{ nome: nome }, { slug: slug }],
          NOT: { id: id }, 
        },
      });

      if (existingCategory) {
        if (existingCategory.nome === nome) {
          throw new ConflictException(`Categoria com o nome '${nome}' já existe.`);
        }
        if (existingCategory.slug === slug) {
          throw new ConflictException(`Categoria com o slug '${slug}' já existe.`);
        }
      }
    }

    
    await this.findOne(id);

    return this.prisma.categoria.update({
      where: { id },
      data: {
        nome,
        slug,
        
      },
    });
  }

  async remove(id: string) {
    
    await this.findOne(id);

    try {
      return await this.prisma.categoria.delete({
        where: { id },
      });
    } catch (error) {
      
      
      if (error.code === 'P2003') {
        throw new ConflictException('Não é possível remover esta categoria, pois existem produtos associados a ela.');
      }
      throw error; 
    }
  }
}