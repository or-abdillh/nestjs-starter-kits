import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    ForbiddenException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Interceptor to format authorization errors
 * 
 * Transforms ForbiddenException into a structured JSON response.
 */
@Injectable()
export class RbacInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                if (error instanceof ForbiddenException) {
                    return throwError(() => ({
                        code: 'FORBIDDEN',
                        message: 'You do not have permission to access this resource',
                        statusCode: 403,
                    }));
                }
                return throwError(() => error);
            }),
        );
    }
}
