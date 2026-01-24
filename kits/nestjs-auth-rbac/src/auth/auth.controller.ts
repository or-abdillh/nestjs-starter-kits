import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { GitHubAuthGuard } from './guards/github-auth.guard';
import { OAuthProfile } from './interfaces/oauth-profile.interface';

/**
 * AuthController - Authentication Endpoints
 * 
 * Provides all authentication endpoints:
 * - Local authentication (register, login)
 * - OAuth authentication (Google, Facebook, GitHub)
 * - User profile retrieval
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * Register a new user with email and password
     */
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: 201,
        description: 'User successfully registered',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(registerDto);
    }

    /**
     * Login with email and password
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({
        status: 200,
        description: 'User successfully logged in',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Request() req, @Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        // User is attached to request by LocalAuthGuard
        return this.authService.login(req.user);
    }

    /**
     * Get current authenticated user
     */
    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: 200,
        description: 'Current user profile',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getProfile(@Request() req): Promise<UserResponseDto> {
        const user = req.user;
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            provider: user.provider,
            createdAt: user.createdAt,
            roles: user.roles,
        };
    }

    /**
     * Initiate Google OAuth flow
     */
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Initiate Google OAuth login' })
    @ApiResponse({ status: 302, description: 'Redirect to Google login' })
    async googleAuth(): Promise<void> {
        // Guard redirects to Google
    }

    /**
     * Google OAuth callback
     */
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Google OAuth callback' })
    @ApiResponse({
        status: 200,
        description: 'Google authentication successful',
        type: AuthResponseDto,
    })
    async googleAuthCallback(@Request() req): Promise<AuthResponseDto> {
        const profile: OAuthProfile = req.user;
        const user = await this.authService.validateOAuthLogin(profile);
        return this.authService.login(user);
    }

    /**
     * Initiate Facebook OAuth flow
     */
    @Get('facebook')
    @UseGuards(FacebookAuthGuard)
    @ApiOperation({ summary: 'Initiate Facebook OAuth login' })
    @ApiResponse({ status: 302, description: 'Redirect to Facebook login' })
    async facebookAuth(): Promise<void> {
        // Guard redirects to Facebook
    }

    /**
     * Facebook OAuth callback
     */
    @Get('facebook/callback')
    @UseGuards(FacebookAuthGuard)
    @ApiOperation({ summary: 'Facebook OAuth callback' })
    @ApiResponse({
        status: 200,
        description: 'Facebook authentication successful',
        type: AuthResponseDto,
    })
    async facebookAuthCallback(@Request() req): Promise<AuthResponseDto> {
        const profile: OAuthProfile = req.user;
        const user = await this.authService.validateOAuthLogin(profile);
        return this.authService.login(user);
    }

    /**
     * Initiate GitHub OAuth flow
     */
    @Get('github')
    @UseGuards(GitHubAuthGuard)
    @ApiOperation({ summary: 'Initiate GitHub OAuth login' })
    @ApiResponse({ status: 302, description: 'Redirect to GitHub login' })
    async githubAuth(): Promise<void> {
        // Guard redirects to GitHub
    }

    /**
     * GitHub OAuth callback
     */
    @Get('github/callback')
    @UseGuards(GitHubAuthGuard)
    @ApiOperation({ summary: 'GitHub OAuth callback' })
    @ApiResponse({
        status: 200,
        description: 'GitHub authentication successful',
        type: AuthResponseDto,
    })
    async githubAuthCallback(@Request() req): Promise<AuthResponseDto> {
        const profile: OAuthProfile = req.user;
        const user = await this.authService.validateOAuthLogin(profile);
        return this.authService.login(user);
    }
}
