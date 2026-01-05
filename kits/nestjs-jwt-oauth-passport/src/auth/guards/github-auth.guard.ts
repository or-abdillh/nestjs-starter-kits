import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * GitHubAuthGuard - Initiates GitHub OAuth flow
 * 
 * Uses GitHubStrategy to redirect user to GitHub login.
 */
@Injectable()
export class GitHubAuthGuard extends AuthGuard('github') { }
