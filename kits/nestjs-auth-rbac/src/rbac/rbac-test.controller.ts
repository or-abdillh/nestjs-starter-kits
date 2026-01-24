import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@ApiTags('RBAC Test')
@ApiBearerAuth('access-token')
@Controller('rbac-test')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RbacTestController {
    @Get('public')
    getPublic() {
        return { message: 'Accessible by authenticated users' };
    }

    @Get('user')
    @Roles(Role.USER)
    getUser() {
        return { message: 'Accessible by USER role' };
    }

    @Get('admin')
    @Roles(Role.ADMIN)
    getAdmin() {
        return { message: 'Accessible by ADMIN role' };
    }

    @Get('super-admin')
    @Roles(Role.SUPER_ADMIN)
    getSuperAdmin() {
        return { message: 'Accessible by SUPER_ADMIN role' };
    }

    @Get('admin-or-user')
    @Roles(Role.ADMIN, Role.USER)
    getAdminOrUser() {
        return { message: 'Accessible by ADMIN or USER role' };
    }
}
