import { JwtPayload } from 'jsonwebtoken';

export interface IJwtPayload extends JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}
