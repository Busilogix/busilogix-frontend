export { apiClient, apiConfig } from "./api";
export { authService } from "./auth.service";
export { customerService } from "./customer.service";
export { imageService } from "./image.service";
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
  BackendInvoice,
  InvoiceListParams,
  InvoiceListPage,
  InvoiceListResult,
  InvoiceStatus,
} from "./types/invoice.types";

export { inventoryService } from "./inventory.service";
export type {
  ApiInventoryLog,
  InventoryLogListPage,
  InventoryLogListParams,
  InventoryLogListResult,
  InventorySummaryData,
} from "./types/inventory.types";

export { dashboardService } from "./dashboard.service";
export type {
  ApiRecentInvoice,
  ApiTopProduct,
  ApiDashboardData,
} from "./types/dashboard.types";

export { salesService } from "./sales.service";
export type {
  SalesReportIntervalData,
  SalesReportData,
  SalesReportParams,
} from "./types/sales.types";

export { productReportService } from "./product-report.service";
export type {
  ProductReportItem,
  ProductReportData,
  ProductReportParams,
} from "./types/product-report.types";

export { gstReportService } from "./gst-report.service";
export type {
  GstReportData,
  GstReportParams,
} from "./types/gst-report.types";

export { inventoryReportService } from "./inventory-report.service";
export type {
  InventoryReportProductItem,
  InventoryReportData,
  InventoryReportParams,
} from "./types/inventory-report.types";export { productService } from "./product.service";
export type {
  ApiProduct,
  ProductCatalogStats,
  ProductListParams,
  ProductListResult,
} from "./types/product.types";

