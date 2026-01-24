import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';

/**
 * GoogleStrategy - Google OAuth 2.0 Authentication
 * 
 * Handles Google OAuth flow:
 * 1. User clicks "Login with Google"
 * 2. Redirected to Google login
 * 3. Google redirects back to callback URL
 * 4. This strategy validates the response
 * 
 * Profile normalization ensures consistent handling across all OAuth providers.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL')!,
            scope: ['email', 'profile'], // Request email and profile data
        });
    }

    /**
     * Validate Google OAuth response
     * Called automatically when Google redirects back to callback URL
     * 
     * @param accessToken - Google access token (not used, we issue our own JWT)
     * @param refreshToken - Google refresh token (not used)
     * @param profile - Google user profile
     * @param done - Passport callback
     */
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<void> {
        // Normalize Google profile to our standard OAuthProfile format
        const oauthProfile: OAuthProfile = {
            provider: 'google',
            providerId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
        };

        done(null, oauthProfile);
    }
}
