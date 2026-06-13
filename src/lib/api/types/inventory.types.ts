export type ApiInventoryLog = {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  action: string;
  quantityChange: number;
  stockAfterAction: number;
  remarks: string;
  createdAt: string;
};

export type InventoryLogListPage = {
  content: ApiInventoryLog[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type InventoryAction =
  | "PRODUCT_CREATED"
  | "STOCK_ADDED"
  | "STOCK_SOLD"
  | "STOCK_ADJUSTED"
  | "PRICE_UPDATED"
  | "PRODUCT_DELETED"
  | "BULK_IMPORTED";

export type InventoryLogListParams = {
  page?: number; // 1-indexed in frontend
  size?: number;
  action?: InventoryAction;
};

export type InventoryLogListResult = {
  items: ApiInventoryLog[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type ActiveProductSummary = {
  productSku: string;
  productName: string;
  movementCount: number;
};

export type InventorySummaryData = {
  totalLogsCount: number;
  affectedProducts: number;
  totalQuantityAdded: number;
  totalQuantityRemoved: number;
  netQuantityChange: number;
  mostActiveProducts: ActiveProductSummary[];
};

export type BulkUploadAudit = {
  id: string;
  storeId: string;
  uploadedBy: string;
  filename: string;
  fileSize: number;
  processedCount: number;
  status: "SUCCESS" | "FAILED";
  errorMessage: string | null;
  createdAt: string;
};

export type BulkUploadAuditListPage = {
  content: BulkUploadAudit[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type BulkUploadAuditListResult = {
  items: BulkUploadAudit[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};


