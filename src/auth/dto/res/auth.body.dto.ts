import { Expose, Type } from 'class-transformer';
import { UserResponseDTO } from 'src/users/dto/res/user.body.dto';

export class TokenBody {
  @Expose()
  access_token: string;

  @Expose()
  refresh_token: string;
}

export class AuthResponseBody {
  @Expose()
  tokens: TokenBody;

  @Expose()
  @Type(() => UserResponseDTO)
  user: UserResponseDTO;
}
