import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '../../user/interfaces/user.interface';

/**
 * LocalStrategy - Email/Password Authentication
 * 
 * Validates user credentials using email and password.
 * Used by the /auth/login endpoint.
 * 
 * Passport expects 'username' and 'password' by default,
 * but we override to use 'email' instead of 'username'.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email', // Use email instead of username
            passwordField: 'password',
        });
    }

    /**
     * Validate user credentials
     * Called automatically by Passport when LocalAuthGuard is used
     * 
     * @param email - User email
     * @param password - User password
     * @returns Validated user
     * @throws UnauthorizedException if credentials are invalid
     */
    async validate(email: string, password: string): Promise<User> {
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return user;
    }
}
