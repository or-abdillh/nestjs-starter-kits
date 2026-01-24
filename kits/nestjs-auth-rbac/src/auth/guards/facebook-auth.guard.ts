import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * FacebookAuthGuard - Initiates Facebook OAuth flow
 * 
 * Uses FacebookStrategy to redirect user to Facebook login.
 */
@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') { }
