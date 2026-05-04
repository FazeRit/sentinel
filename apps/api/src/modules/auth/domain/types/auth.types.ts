export interface IJwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
