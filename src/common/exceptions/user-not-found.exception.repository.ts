import { RepositoryException } from './exception.repository';

export class UserNotFoundRepositoryException extends RepositoryException {
  constructor(message: string = 'user not found') {
    super(message);
    this.name = UserNotFoundRepositoryException.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
