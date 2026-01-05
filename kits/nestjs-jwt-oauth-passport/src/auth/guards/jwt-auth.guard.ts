import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard - Protects routes requiring authentication
 * 
 * Uses JwtStrategy to validate JWT tokens from Authorization header.
 * Attach to any endpoint that requires authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
