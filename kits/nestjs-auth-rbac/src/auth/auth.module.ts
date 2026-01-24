import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GitHubStrategy } from './strategies/github.strategy';

/**
 * AuthModule - Authentication Module
 * 
 * Configures:
 * - JWT authentication with environment-based secret and expiration
 * - Passport strategies (Local, JWT, Google, Facebook, GitHub)
 * - Authentication endpoints
 * 
 * All strategies follow a consistent pattern for easy extension.
 */
@Module({
    imports: [
        UserModule,
        PassportModule,
        ConfigModule,
        // Configure JWT module with environment variables
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const expiresIn = configService.get<string>('JWT_EXPIRES_IN') || '1h';
                return {
                    secret: configService.get<string>('JWT_SECRET') || 'default-secret-change-in-production',
                    signOptions: {
                        expiresIn: expiresIn as any, // Type assertion needed for JWT library compatibility
                    },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        // Register all Passport strategies
        LocalStrategy,
        JwtStrategy,
        GoogleStrategy,
        FacebookStrategy,
        GitHubStrategy,
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule { }
