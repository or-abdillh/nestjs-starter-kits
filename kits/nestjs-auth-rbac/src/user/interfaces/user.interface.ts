/**
 * User entity interface
 * 
 * Represents a user in the system. Users can be created via:
 * - Local registration (email/password)
 * - OAuth providers (Google, Facebook, GitHub)
 * 
 * For OAuth users, password will be null and provider/providerId will be set.
 */
export interface User {
    /**
     * Unique user identifier
     */
    id: string;

    /**
     * User's email address (unique)
     */
    email: string;

    /**
     * Hashed password (null for OAuth users)
     */
    password?: string;

    /**
     * User's first name
     */
    firstName: string;

    /**
     * User's last name
     */
    lastName: string;

    /**
     * OAuth provider name (e.g., 'google', 'facebook', 'github')
     * Null for local users
     */
    provider?: string;

    /**
     * OAuth provider's user ID
     * Null for local users
     */
    providerId?: string;

    /**
     * Account creation timestamp
     */
    createdAt: Date;

    /**
     * User roles
     */
    roles?: import('../../rbac/role.enum').Role[];
}
