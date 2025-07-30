import { RepositoryException } from './exception.repository';

export class TransactionNotFoundRepositoryException extends RepositoryException {
  constructor(message: string = 'transaction not found') {
    super(message);
    this.name = TransactionNotFoundRepositoryException.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
