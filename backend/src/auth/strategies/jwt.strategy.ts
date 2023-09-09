import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { UsersService } from '../../users/users.service';
import { IJwtPayload } from '../../common/types';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly userService: UsersService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('JWT_SECRET') || 'supersecret',
//     });
//   }

//   async validate(payload: IJwtPayload) {
//     const user = await this.userService.findOne({
//       where: { id: payload.id, username: payload.username },
//     });
//     if (!user) {
//       throw new UnauthorizedException(`Неправильный токен пользователя`);
//     }
//     return user;
//   }
// }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
    });
  }

  async validate(payload: IJwtPayload) {
    return { id: payload.id, username: payload.username };
  }
}
