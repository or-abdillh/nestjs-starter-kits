/**
 * Normalized OAuth profile
 * 
 * Different OAuth providers return different profile structures.
 * This interface normalizes them for consistent handling.
 */
export interface OAuthProfile {
    /**
     * OAuth provider name (e.g., 'google', 'facebook', 'github')
     */
    provider: string;

    /**
     * Provider's user ID
     */
    providerId: string;

    /**
     * User email
     */
    email: string;

    /**
     * User first name
     */
    firstName: string;

    /**
     * User last name
     */
    lastName: string;
}
