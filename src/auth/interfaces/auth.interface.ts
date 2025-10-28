import { User } from '../../entities/user.entity';

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    type: string;
    phone: string;
    createdAt: Date;
  };
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  type: string;
}
