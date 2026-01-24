import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';

/**
 * FacebookStrategy - Facebook OAuth Authentication
 * 
 * Handles Facebook OAuth flow following the same pattern as Google.
 * Normalizes Facebook profile to our standard OAuthProfile format.
 */
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>('FACEBOOK_CLIENT_ID')!,
            clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET')!,
            callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL')!,
            scope: ['email'], // Request email permission
            profileFields: ['emails', 'name'], // Request specific fields
        });
    }

    /**
     * Validate Facebook OAuth response
     * 
     * @param accessToken - Facebook access token (not used)
     * @param refreshToken - Facebook refresh token (not used)
     * @param profile - Facebook user profile
     * @param done - Passport callback
     */
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void,
    ): Promise<void> {
        // Normalize Facebook profile to our standard format
        const oauthProfile: OAuthProfile = {
            provider: 'facebook',
            providerId: profile.id,
            email: profile.emails?.[0]?.value || '',
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
        };

        done(null, oauthProfile);
    }
}
