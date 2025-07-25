import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('users') 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Usando o ValidationPipe para validar os dados de entrada
  //Isso garante que o DTO CreateUserDto seja validado antes de ser processado
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    console.log('Usuário autenticado acessando /users:', req.user)
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    console.log(`Usuário autenticado acessando /users/:id: ${id}`);
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    // Usaremos DTOs reais aqui depois
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
