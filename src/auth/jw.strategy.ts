// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; 
import { UsersService } from '../users/users.service'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService, 
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false, 
      secretOrKey: configService.get<string>('JWT_SECRET') as string, 
    });
  }

  async validate(payload: any) {
    
    const user = await this.usersService.findOneById(payload.sub); 

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado ou inativo.');
    }

    const { senha, ...result } = user;
    return result;
  }
}