import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RequestUser } from 'src/auth/auth.types';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

interface CustomRequest extends Request{
    user: RequestUser
}

@Controller('reviews')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@UseGuards(JwtAuthGuard)

export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createReviewDto: CreateReviewDto, @Req() req: CustomRequest){
        const userId = req.user.id
        return this.reviewsService.create(userId, createReviewDto)
    }

    @Get()
    async finAll(@Query ('productId') productId?: string){
        return this.reviewsService.findAll(productId)
    }

    @Get(':id')
    async findOne(@Param ('Id') id: string){
        return this.reviewsService.findOne(id)
    }

    @Patch(':id')
    async update(@Param('id') id:string, @Body() updateReviewDto: UpdateReviewDto, @Req() req: CustomRequest ){
        const userId = req.user.id
        return this.reviewsService.update(id, userId, updateReviewDto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id:string, @Req() req:CustomRequest){
        const userId = req.user.id
        const userRole = req.user.role
        await this.reviewsService.remove(id, userId, userRole)
    }
}
