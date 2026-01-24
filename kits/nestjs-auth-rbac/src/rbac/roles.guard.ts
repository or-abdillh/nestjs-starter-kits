import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

/**
 * Guard to enforce role-based access control
 * 
 * Checks if the user has the required roles to access the route.
 * Assumes that the user is already authenticated and attached to the request.
 */
@Injectable()
export class RolesGuard implements CanActivate {

    private readonly logger = new Logger(RolesGuard.name);

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.roles) {
            this.logger.warn(`User not found or no roles attached to request. User object: ${user}`);
            return false;
        }

        const hasRole = requiredRoles.some((role) => user.roles?.includes(role));

        return hasRole;
    }
}
