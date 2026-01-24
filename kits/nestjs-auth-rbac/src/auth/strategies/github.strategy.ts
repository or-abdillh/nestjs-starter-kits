import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';

/**
 * GitHubStrategy - GitHub OAuth Authentication
 * 
 * Handles GitHub OAuth flow following the same pattern as Google and Facebook.
 * Normalizes GitHub profile to our standard OAuthProfile format.
 */
@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>('GITHUB_CLIENT_ID')!,
            clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET')!,
            callbackURL: configService.get<string>('GITHUB_CALLBACK_URL')!,
            scope: ['user:email'], // Request email access
        });
    }

    /**
     * Validate GitHub OAuth response
     * 
     * @param accessToken - GitHub access token (not used)
     * @param refreshToken - GitHub refresh token (not used)
     * @param profile - GitHub user profile
     * @param done - Passport callback
     */
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void,
    ): Promise<void> {
        // GitHub profile structure is different, need to parse name
        const fullName = profile.displayName || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || profile.username || 'GitHub';
        const lastName = nameParts.slice(1).join(' ') || 'User';

        // Normalize GitHub profile to our standard format
        const oauthProfile: OAuthProfile = {
            provider: 'github',
            providerId: profile.id,
            email: profile.emails?.[0]?.value || '',
            firstName,
            lastName,
        };

        done(null, oauthProfile);
    }
}
