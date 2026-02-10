export interface JwtPayload {
  sub: string; // user id
  email: string;
  organizationId: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    organizationId: string;
  };
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  organizationName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
