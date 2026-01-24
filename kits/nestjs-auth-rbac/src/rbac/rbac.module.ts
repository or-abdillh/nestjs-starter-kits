import { Module, Global } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { RbacInterceptor } from './rbac.interceptor';

import { RbacTestController } from './rbac-test.controller';

@Global()
@Module({
    controllers: [RbacTestController],
    providers: [
        RolesGuard,
        {
            provide: APP_INTERCEPTOR,
            useClass: RbacInterceptor,
        },
    ],
    exports: [RolesGuard],
})
export class RbacModule { }
