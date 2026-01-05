import * as bcrypt from 'bcrypt';

/**
 * Number of salt rounds for bcrypt hashing
 * Higher = more secure but slower
 * 10 is a good balance for production
 */
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * 
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password with a hashed password
 * 
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns True if passwords match, false otherwise
 */
export async function comparePassword(
    password: string,
    hashedPassword: string,
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}
