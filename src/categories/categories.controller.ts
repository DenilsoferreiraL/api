import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create (@Body() createCategoryDto: CreateCategoryDto){
        return this.categoriesService.create(createCategoryDto)
    }

    @Get(':id')
    async findAll(){
        return this.categoriesService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: string){
        return this.categoriesService.findOne(id)
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateCategoryDto:UpdateCategoryDto){
        return this.categoriesService.update(id, updateCategoryDto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id')id: string){
        await this.categoriesService.remove(id)
    }
}
