import statusCodes from '../statusCodes'

class AbstractError extends Error {
  private meta: Record<string, unknown>

  public constructor(message: string, meta: Record<string, unknown> = {}) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.meta = meta
  }

  public toJSON(): Record<string, unknown> {
    return {
      message: this.message,
      metaData: this.meta,
    }
  }
}

export class ValidationError extends AbstractError {
  public constructor(resource: string, meta: { errorMessage: string; payload: Record<string, unknown> }) {
    super('Validation Error', {
      code: statusCodes.BAD_REQUEST,
      errorMessage: meta.errorMessage,
      payload: meta.payload,
      where: resource,
    })
  }
}
export class UnknownError extends AbstractError {}
export class UnauthorizeError extends AbstractError {}
export class NotFoundError extends AbstractError {
  public constructor(resource: string, meta: { errorMessage: string; payload: Record<string, unknown> }) {
    super(meta.errorMessage, {
      code: statusCodes.NOT_FOUND,
      errorMessage: meta.errorMessage,
      payload: meta.payload,
      where: resource,
    })
  }
}
export class BadGateway extends AbstractError {
  public constructor(resource: string, meta: { errorMessage: string; payload: Record<string, unknown> }) {
    super('External service has failed', {
      code: statusCodes.BAD_GATEWAY,
      errorMessage: meta.errorMessage,
      payload: meta.payload,
      where: resource,
    })
  }
}
