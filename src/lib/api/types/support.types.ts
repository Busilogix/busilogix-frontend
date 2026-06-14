export interface SupportRequestPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SupportMutationResponse {
  message: string;
}
