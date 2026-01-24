import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../../user/interfaces/user.interface';

/**
 * JwtStrategy - JWT Token Validation
 * 
 * Validates JWT tokens from the Authorization header.
 * Used by JwtAuthGuard to protect routes.
 * 
 * Extracts token from: Authorization: Bearer <token>
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // Reject expired tokens
            secretOrKey: configService.get<string>('JWT_SECRET')!,
        });
    }

    /**
     * Validate JWT payload and return user
     * Called automatically by Passport after token is verified
     * 
     * @param payload - Decoded JWT payload
     * @returns User if found
     * @throws UnauthorizedException if user not found
     */
    async validate(payload: JwtPayload): Promise<User> {
        const user = await this.userService.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }
}
