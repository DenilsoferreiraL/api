// src/orders/orders.controller.ts
import {
  Body,
  Controller,
  Delete, // <-- Certifique-se que Delete está aqui
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RequestUser } from '../auth/auth.types'; 
import { JwtAuthGuard } from 'src/auth/auth.guard';

// Definição de tipo para o objeto Request personalizado
// Para que o TypeScript saiba que `req.user` existe e tem o tipo `RequestUser`
interface CustomRequest extends Request {
  user: RequestUser;
}

@Controller('orders')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Use CustomRequest para tipar o parâmetro req
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: CustomRequest) {
    const userId = req.user.id; // Agora req.user.id terá o tipo correto
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get() // <-- CORREÇÃO: Remova o ':id' aqui para findAll
  async findAll(@Req() req: CustomRequest) {
    const userRole = req.user.role; // Agora req.user.role terá o tipo correto
    const userId = req.user.id;
    return this.ordersService.findAll(userRole, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: CustomRequest) {
    const userRole = req.user.role;
    const userId = req.user.id;
    return this.ordersService.findOne(id, userRole, userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: CustomRequest,
  ) {
    const userRole = req.user.role;
    return this.ordersService.updateStatus(
      id,
      { status: updateOrderDto.status },
      userRole,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: CustomRequest) {
    const userRole = req.user.role;
    await this.ordersService.remove(id, userRole);
  }
}