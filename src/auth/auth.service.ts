import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ){}
    
    async validateUser(email: string, pass: string): Promise<any>{
        const user = await this.usersService.findOneByEmail(email);

        if(!user){
            return null;
        }

        const isPasswordValid = await bcrypt.compare(pass, user.senha)

        if(user && isPasswordValid){
            const { senha, ...result } = user; // Exclui a senha do resultado
            return result;
        }

        return null

    }

    async login(loginUserDto: LoginUserDto){
        const user = await this.validateUser(loginUserDto.email, loginUserDto.senha)

        if(!user){
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = {email: user.email, sub: user.id, role: user.role};

        return{
            acess_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role,
            }
        }
    }

}
