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

export type InventoryLogListParams = {
  page?: number; // 1-indexed in frontend
  size?: number;
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
