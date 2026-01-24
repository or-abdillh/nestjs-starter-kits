/**
 * JWT payload structure
 * 
 * Contains minimal user information for token validation.
 * Do NOT include sensitive data like passwords or full user objects.
 */
export interface JwtPayload {
    /**
     * Subject - User ID
     */
    sub: string;

    /**
     * User email
     */
    email: string;

    /**
     * User roles
     */
    roles: import('../../rbac/role.enum').Role[];
}
