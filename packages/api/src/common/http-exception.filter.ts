import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{
      status: (code: number) => { json: (body: unknown) => void };
    }>();
    const request = ctx.getRequest<{ url: string }>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();

      const normalized =
        typeof payload === 'object' && payload !== null
          ? payload
          : { message: String(payload) };

      response.status(status).json({
        error: {
          ...(normalized as Record<string, unknown>),
          statusCode: status
        },
        path: request.url,
        timestamp: new Date().toISOString()
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      },
      path: request.url,
      timestamp: new Date().toISOString()
    });
  }
}
