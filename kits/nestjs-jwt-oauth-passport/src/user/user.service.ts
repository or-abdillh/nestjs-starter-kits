import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { randomUUID } from 'crypto';

/**
 * UserService - In-Memory User Store
 * 
 * This service provides user management with an in-memory store.
 * In production, replace this with your database solution (TypeORM, Prisma, Mongoose, etc.)
 * 
 * The interface is designed to be database-agnostic for easy swapping.
 */
@Injectable()
export class UserService {
    /**
     * In-memory user storage
     * Replace with database queries in production
     */
    private users: User[] = [];

    /**
     * Create a new user
     * 
     * @param userData - Partial user data
     * @returns Created user
     * @throws ConflictException if email already exists
     */
    async create(userData: Partial<User>): Promise<User> {
        // Validate required fields
        if (!userData.email || !userData.firstName || !userData.lastName) {
            throw new ConflictException('Email, firstName, and lastName are required');
        }

        // Check if email already exists
        const existingUser = await this.findByEmail(userData.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const user: User = {
            id: randomUUID(),
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            provider: userData.provider,
            providerId: userData.providerId,
            createdAt: new Date(),
        };

        this.users.push(user);
        return user;
    }

    /**
     * Find user by email
     * 
     * @param email - User's email address
     * @returns User if found, null otherwise
     */
    async findByEmail(email: string): Promise<User | null> {
        const user = this.users.find((u) => u.email === email);
        return user || null;
    }

    /**
     * Find user by ID
     * 
     * @param id - User's unique identifier
     * @returns User if found, null otherwise
     */
    async findById(id: string): Promise<User | null> {
        const user = this.users.find((u) => u.id === id);
        return user || null;
    }

    /**
     * Find user by OAuth provider and provider ID
     * 
     * @param provider - OAuth provider name (e.g., 'google', 'facebook')
     * @param providerId - Provider's user ID
     * @returns User if found, null otherwise
     */
    async findByProvider(provider: string, providerId: string): Promise<User | null> {
        const user = this.users.find(
            (u) => u.provider === provider && u.providerId === providerId,
        );
        return user || null;
    }

    /**
     * Find or create OAuth user
     * 
     * This method handles OAuth user creation/linking:
     * 1. Check if user exists by provider + providerId
     * 2. If not, check if user exists by email
     * 3. If exists by email, link the OAuth account
     * 4. If not exists, create new user
     * 
     * @param profile - OAuth profile data
     * @returns Existing or newly created user
     */
    async findOrCreateOAuthUser(profile: {
        provider: string;
        providerId: string;
        email: string;
        firstName: string;
        lastName: string;
    }): Promise<User> {
        // Check if user exists with this OAuth provider
        let user = await this.findByProvider(profile.provider, profile.providerId);

        if (user) {
            return user;
        }

        // Check if user exists with this email (account linking)
        user = await this.findByEmail(profile.email);

        if (user) {
            // Link OAuth account to existing user
            // In production, you might want to store multiple OAuth providers per user
            user.provider = profile.provider;
            user.providerId = profile.providerId;
            return user;
        }

        // Create new user
        return this.create({
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            provider: profile.provider,
            providerId: profile.providerId,
        });
    }
}
