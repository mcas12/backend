import { HttpException, HttpStatus } from '@nestjs/common'

export class BaseError extends HttpException {
  /**
   * Base custom error
   * @param {String} message
   * @param {Error} cause
   * @param statusCode
   */
  constructor(
    message: string,
    cause?: Error,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode, { cause })
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class SendEmailError extends BaseError {
  /**
   * @param {String} message
   * @param {Error} cause
   */
  constructor(message?: string, cause?: Error) {
    super(message ?? 'Failed to send email', cause)
  }
}

export class SendGridError extends BaseError {
  /**
   * @param {String} message
   * @param {Error} cause
   */
  constructor(message?: string, cause?: Error) {
    super(message ?? 'SendGrid error', cause)
  }
}

export class DaoError extends BaseError {
  /**
   * @param {String} message
   * @param {Error} cause
   */
  constructor(message?: string, cause?: Error) {
    super(message ?? 'Failed to manipulate database', cause)
  }
}

export class WrongCallError extends BaseError {
  /**
   * @param {String} message
   * @param {Error} cause
   */
  constructor(message?: string, cause?: Error) {
    super(message ?? 'Wrong call', cause, HttpStatus.BAD_REQUEST)
  }
}

export class InvalidParamsError extends BaseError {
  /**
   * @param {String} message
   * @param {Error} cause
   */
  constructor(message?: string, cause?: Error) {
    super(message ?? 'Invalid parameters', cause, HttpStatus.BAD_REQUEST)
  }
}

export class InvalidEmailAddressError extends BaseError {
  /**
   * @param {String} message
   * @param {Error} cause
   */
  constructor(message?: string, cause?: Error) {
    super(message ?? 'Invalid email address', cause, HttpStatus.BAD_REQUEST)
  }
}
export class AccountExists extends BaseError {
  /**
   * @param {String} message
   * @param {Error} cause
   */
  constructor(message?: string, cause?: Error) {
    super(
      message ??
        'Account already exists, Please try changing your email address',
      cause,
      HttpStatus.BAD_REQUEST
    )
  }
}
export class AccountNotActivated extends BaseError {
  /**
   * @param {String} message
   * @param {Error} cause
   */
  constructor(message?: string, cause?: Error) {
    super(
      message ?? 'Account is still not activated',
      cause,
      HttpStatus.BAD_REQUEST
    )
  }
}
export class AccountNotExists extends BaseError {
  /**
   * @param {String} message
   * @param {Error} cause
   */
  constructor(message?: string, cause?: Error) {
    super(message ?? 'The account does not exist', cause, HttpStatus.NOT_FOUND)
  }
}

export class UnknownError extends BaseError {
  /**
   * @param {Error} cause
   * @param {String} message
   */
  constructor(cause?: Error, message?: string) {
    super(
      message ?? cause?.message ?? 'Unknown error',
      cause,
      cause?.['status'] ?? HttpStatus.INTERNAL_SERVER_ERROR
    )
  }
}
