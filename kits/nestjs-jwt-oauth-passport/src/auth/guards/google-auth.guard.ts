import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * GoogleAuthGuard - Initiates Google OAuth flow
 * 
 * Uses GoogleStrategy to redirect user to Google login.
 */
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') { }
