import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AccountResponseDto } from 'src/accounts/dto/res/account.body.dto';
import { AuthResponseBody } from 'src/auth/dto/res/auth.body.dto';
import { transactionResponseDto } from 'src/transactions/dto/res/transactions.body.dto';
import { UserResponseDTO } from 'src/users/dto/res/user.body.dto';
import { mapEntityToDto } from 'src/utils/mapper.util';

@Injectable()
export class SerializationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    let dtoClass: any;
    if (request.url.includes('/users')) {
      dtoClass = UserResponseDTO;
    } else if (request.url.includes('/auth')) {
      dtoClass = AuthResponseBody;
    } else if (request.url.includes('/accounts')) {
      dtoClass = AccountResponseDto;
    } else if (request.url.includes('/transactions')) {
      dtoClass = transactionResponseDto;
    }

    return next.handle().pipe(
      map((data) => {
        if (!dtoClass || !data) return data;

        if (Array.isArray(data)) {
          return data.map((item) => mapEntityToDto(dtoClass, item));
        } else {
          return mapEntityToDto(dtoClass, data);
        }
      }),
    );
  }
}
