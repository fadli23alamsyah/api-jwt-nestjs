import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => data),
      catchError((error) => {
        const response = context.switchToHttp().getResponse();

        if (error instanceof HttpException) {
          const responseError = error.getResponse();
          const message =
            responseError.constructor == String
              ? responseError
              : Object(responseError).message;

          return throwError(() =>
            response.status(error.getStatus()).json({
              message: message,
            }),
          );
        }

        return throwError(() => {
          response.status(error.getStatus()).json({
            message: error.message,
          });
        });
      }),
    );
  }
}
