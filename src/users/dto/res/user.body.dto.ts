import { Account, Role, Transaction } from '@prisma/client';

export class UserResponseDTO {
  id: string;
  email: string;
  full_name: string;
  role: Role;
}

export class UserWithAccountsResponseDto extends UserResponseDTO {
  accounts: Account[];
}

export class UserWithFinancialProfileResponseDto extends UserResponseDTO {
  accounts: {
    id: string;
    account_number: string;
    account_type: string;
    balance: number;
    transactions: Transaction[];
  };
}
