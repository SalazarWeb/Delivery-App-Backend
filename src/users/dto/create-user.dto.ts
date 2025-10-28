import { UserType } from '../../entities/user.entity';

export class CreateUserDto {
  type: UserType;
  name: string;
  phone: string;
  email: string;
  passwordHash: string;
}
