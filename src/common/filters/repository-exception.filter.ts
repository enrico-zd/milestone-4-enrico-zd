import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { RepositoryException } from '../exceptions/exception.repository';
import { ErrorBody } from '../dto/res/error.body.dto';
import { UserNotFoundRepositoryException } from '../exceptions/user-not-found.exception.repository';
import { AccountNotFoundRepositoryException } from '../exceptions/account-not-found.exception.repository';
import { TransactionNotFoundRepositoryException } from '../exceptions/transaction-not-found.exception.repository';

@Catch(RepositoryException)
export class RepositoryExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: RepositoryException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let responseBody: ErrorBody = {
      message: 'something wrong on our side',
      error: 'internal service error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    if (exception instanceof UserNotFoundRepositoryException) {
      responseBody = {
        message: exception.message,
        error: exception.name,
        statusCode: HttpStatus.NOT_FOUND,
      };
    } else if (exception instanceof AccountNotFoundRepositoryException) {
      responseBody = {
        message: exception.message,
        error: exception.name,
        statusCode: HttpStatus.NOT_FOUND,
      };
    } else if (exception instanceof TransactionNotFoundRepositoryException) {
      responseBody = {
        message: exception.message,
        error: exception.name,
        statusCode: HttpStatus.NOT_FOUND,
      };
    }

    httpAdapter.reply(res, responseBody, responseBody.statusCode);
  }
}
