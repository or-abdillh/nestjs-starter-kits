import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

/**
 * Metadata key for roles
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to assign roles to specific routes or controllers
 * 
 * @param roles - List of roles allowed to access the route
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
