import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import slugify from 'slugify';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    const { nome } = createBrandDto;
    const slug = slugify(nome, { lower: true, strict: true });


    const existingBrand = await this.prisma.marca.findFirst({
      where: {
        OR: [{ nome: nome }, { slug: slug }],
      },
    });

    if (existingBrand) {
      if (existingBrand.nome === nome) {
        throw new ConflictException(`Marca com o nome '${nome}' já existe.`);
      }
      if (existingBrand.slug === slug) {
        throw new ConflictException(`Marca com o slug '${slug}' já existe.`);
      }
    }


    return this.prisma.marca.create({
      data: {
        nome,
        slug,
      },
    });
  }

  async findAll() {
    return this.prisma.marca.findMany();
  }

  async findOne(id: string) {
    const brand = await this.prisma.marca.findUnique({
      where: { id },
    });
    if (!brand) {
      throw new NotFoundException(`Marca com ID '${id}' não encontrada.`);
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const { nome } = updateBrandDto;
    let slug: string | undefined;

    if (nome) {
      slug = slugify(nome, { lower: true, strict: true });

    
      const existingBrand = await this.prisma.marca.findFirst({
        where: {
          OR: [{ nome: nome }, { slug: slug }],
          NOT: { id: id },
        },
      });

      if (existingBrand) {
        if (existingBrand.nome === nome) {
          throw new ConflictException(`Marca com o nome '${nome}' já existe.`);
        }
        if (existingBrand.slug === slug) {
          throw new ConflictException(`Marca com o slug '${slug}' já existe.`);
        }
      }
    }


    await this.findOne(id);

    return this.prisma.marca.update({
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
      return await this.prisma.marca.delete({
        where: { id },
      });
    } catch (error) {
    
    
      if (error.code === 'P2003') {
        throw new ConflictException('Não é possível remover esta marca, pois existem produtos associados a ela.');
      }
      throw error;
    }
  }
}