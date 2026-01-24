import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard - Protects local authentication endpoints
 * 
 * Uses LocalStrategy to validate email/password credentials.
 * Attach to login endpoint.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { }
