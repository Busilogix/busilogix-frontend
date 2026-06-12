export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

export type BackendEnvelope<T = undefined> = {
  timestamp: string;
  status: string;
  message: string;
  data?: T;
};

export type LoginTokenData = {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
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
  message: string;
  tokens: LoginTokenData;
};

export type SignupResponse = {
  message: string;
};

export type RefreshTokenRequest = {
  refresh_token: string;
};

export type RefreshTokenResponse = AuthTokenResponse;

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword?: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type ResendVerificationRequest = {
  email: string;
};

export type ResendVerificationResponse = {
  message: string;
};

