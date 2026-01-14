export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, 'VALIDATION_ERROR', message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(404, 'NOT_FOUND', `${resource} with ID ${id} not found`);
    this.name = 'NotFoundError';
  }
}

export class InvalidStatusTransitionError extends AppError {
  constructor(currentStatus: string, targetStatus: string) {
    super(
      400,
      'INVALID_STATUS_TRANSITION',
      `Cannot transition from '${currentStatus}' to '${targetStatus}'`
    );
    this.name = 'InvalidStatusTransitionError';
  }
}
