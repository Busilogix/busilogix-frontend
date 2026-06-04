export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  mobile: string;
  password: string;
};

export type AuthTokenResponse = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  created_at?: string;
  updated_at?: string;
};

export type LoginResponse = {
  user: AuthUser;
  tokens: AuthTokenResponse;
};

export type SignupResponse = {
  user: AuthUser;
  tokens: AuthTokenResponse;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type RefreshTokenResponse = AuthTokenResponse;
