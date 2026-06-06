export { apiClient, apiConfig } from "./api";
export { authService } from "./auth.service";
export { customerService } from "./customer.service";
export { invoiceService } from "./invoice.service";

export { ApiError, isApiError, normalizeAxiosError } from "./errors";

export {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  hasAccessToken,
  setTokens,
  type AuthTokens,
} from "./token-storage";

export type {
  ApiErrorBody,
  ApiMeta,
  ApiResponse,
  ApiResultStatus,
  ListQueryParams,
  PaginatedApiResponse,
  PaginationMeta,
} from "./types/api.types";

export type {
  AuthTokenResponse,
  AuthUser,
  BackendEnvelope,
  LoginRequest,
  LoginResponse,
  LoginTokenData,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignupRequest,
  SignupResponse,
} from "./types/auth.types";

export type {
  ApiCustomer,
  CreateCustomerRequest,
  CreateCustomerResponse,
  Customer,
  CustomerAddress,
  CustomerListPage,
  CustomerListParams,
  CustomerListResult,
  CustomerStatus,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
} from "./types/customer.types";

export type {
  CreateInvoiceRequest,
  Invoice,
  InvoiceLineItem,
  InvoiceListParams,
  InvoiceStatus,
  UpdateInvoiceRequest,
} from "./types/invoice.types";
