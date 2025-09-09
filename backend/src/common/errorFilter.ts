import {
  ArgumentsHost,
  Catch,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  MethodNotAllowedException,
  NotFoundException
} from '@nestjs/common'

import { v4 as uuid } from 'uuid'

import { BaseExceptionFilter } from '@nestjs/core'

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const { httpAdapter } = this.httpAdapterHost

    const request = ctx.getRequest()
    const path = `[${httpAdapter.getRequestMethod(
      request
    )}]${httpAdapter.getRequestUrl(request)}`

    if (
      exception instanceof NotFoundException ||
      exception instanceof MethodNotAllowedException ||
      exception instanceof ForbiddenException
    ) {
      super.catch(exception, host)
      this.logger.log(
        `${exception['name']}: ${exception['message']} === ${path}`
      )
      return
    }

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    const traceId = uuid()

    const responseBody = {
      statusCode,
      timestamp: new Date().toISOString(),
      path,
      traceId,
      message: exception['message'],
      error:
        exception['description'] ??
        exception['options']?.['description'] ??
        exception['name']
    }
    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode)

    this.logger.error(
      `${exception['name']}: ${exception['message']} === [${traceId}] === ${path} >>>`,
      exception['stack'],
      `<<< [${traceId}] === ${path}`
    )
    if (exception['cause']) {
      this.logger.error(
        `${exception['name']}: ${exception['message']} === [${traceId}] === ${path} >>>`,
        exception['cause'],
        `<<< [${traceId}] === ${path}`
      )
    }
    const requestData = request.body ?? request.params
    if (requestData) {
      this.logger.debug(
        'request data:' + JSON.stringify(requestData),
        `<<< [${traceId}] === ${path}`
      )
    }
  }
}
