import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/interfaces/user.interface';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { OAuthProfile } from './interfaces/oauth-profile.interface';
import { hashPassword, comparePassword } from '../common/utils/hash.util';
import { Role } from '../rbac/role.enum';

/**
 * AuthService - Core Authentication Logic
 * 
 * Handles:
 * - User registration
 * - Credential validation
 * - JWT token generation
 * - OAuth user creation/linking
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * In-memory user storage
     * Replace with database queries in production
     */
    private users: User[] = [];

    /**
     * Validate user credentials for local authentication
     * Used by LocalStrategy
     * 
     * @param email - User email
     * @param password - Plain text password
     * @returns User if valid, null otherwise
     */
    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            return null;
        }

        // OAuth users don't have passwords
        if (!user.password) {
            return null;
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return null;
        }

        return user;
    }

    /**
     * Register a new user with email and password
     * 
     * @param registerDto - Registration data
     * @returns Authentication response with JWT token
     */
    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        // Hash password before storing
        const hashedPassword = await hashPassword(registerDto.password);

        const user = await this.userService.create({
            email: registerDto.email,
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            roles: registerDto.roles,
        });

        return this.generateAuthResponse(user);
    }

    /**
     * Login user and generate JWT token
     * 
     * @param user - Authenticated user
     * @returns Authentication response with JWT token
     */
    async login(user: User): Promise<AuthResponseDto> {
        return this.generateAuthResponse(user);
    }

    /**
     * Validate OAuth login and create/link user
     * Used by OAuth strategies
     * 
     * @param profile - Normalized OAuth profile
     * @returns Authenticated user
     */
    async validateOAuthLogin(profile: OAuthProfile): Promise<User> {
        const user = await this.userService.findOrCreateOAuthUser(profile);
        return user;
    }

    /**
     * Generate authentication response with JWT token
     * 
     * @param user - User to generate token for
     * @returns Authentication response
     */
    private generateAuthResponse(user: User): AuthResponseDto {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            roles: user.roles || [],
        };

        const accessToken = this.jwtService.sign(payload);

        // Remove sensitive data from user object
        const userResponse: UserResponseDto = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            provider: user.provider,
            createdAt: user.createdAt,
            roles: user.roles,
        };

        return {
            accessToken,
            user: userResponse,
        };
    }
}
