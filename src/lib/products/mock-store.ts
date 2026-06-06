import type {
  ProductRecord,
  ProductFormValues,
  StockAdjustmentLog,
  ProductQueryParams,
  ProductQueryResult,
} from "./types";

const PRODUCTS_STORAGE_KEY = "busilogix_mock_products";
const LOGS_STORAGE_KEY = "busilogix_mock_inventory_logs";

const SEED_PRODUCTS: ProductRecord[] = [
  {
    id: "prod_001",
    name: "Pro Laptop Stand",
    sku: "PRO-STAND-01",
    description:
      "Ergonomic aluminum stand compatible with laptops from 11 to 17 inches.",
    price: 49.99,
    category: "Office Supplies",
    status: "active",
    stock: 120,
    min_stock_level: 20,
    created_at: "2025-11-02T10:00:00Z",
    updated_at: "2025-11-02T10:00:00Z",
  },
  {
    id: "prod_002",
    name: "Ergonomic Keyboard",
    sku: "ERGO-KEY-02",
    description:
      "Split key design with wrist rest and tactile mechanical switches.",
    price: 129.99,
    category: "Electronics",
    status: "active",
    stock: 12, // Low stock!
    min_stock_level: 15,
    created_at: "2025-11-05T14:30:00Z",
    updated_at: "2025-11-08T09:15:00Z",
  },
  {
    id: "prod_003",
    name: "UltraWide Monitor",
    sku: "WIDE-MON-03",
    description:
      "34-inch curved display with 144Hz refresh rate and USB-C power delivery.",
    price: 399.99,
    category: "Electronics",
    status: "active",
    stock: 8, // Low stock!
    min_stock_level: 10,
    created_at: "2025-11-10T08:00:00Z",
    updated_at: "2025-11-10T08:00:00Z",
  },
  {
    id: "prod_004",
    name: "USB-C Multi-port Hub",
    sku: "HUB-USBC-04",
    description:
      "8-in-1 adapter with HDMI, SD reader, and pass-through charging.",
    price: 29.99,
    category: "Accessories",
    status: "active",
    stock: 250,
    min_stock_level: 30,
    created_at: "2025-11-12T11:20:00Z",
    updated_at: "2025-11-15T16:45:00Z",
  },
  {
    id: "prod_005",
    name: "Noise Cancelling Headphones",
    sku: "ANC-HEAD-05",
    description:
      "Wireless over-ear headphones with active noise cancellation and 40h battery.",
    price: 199.99,
    category: "Electronics",
    status: "inactive",
    stock: 3,
    min_stock_level: 8,
    created_at: "2025-11-18T09:00:00Z",
    updated_at: "2025-11-20T12:00:00Z",
  },
];

const SEED_LOGS: StockAdjustmentLog[] = [
  {
    id: "log_001",
    product_id: "prod_001",
    product_name: "Pro Laptop Stand",
    sku: "PRO-STAND-01",
    type: "adjustment",
    quantity: 120,
    reason: "Initial seed inventory load",
    timestamp: "2025-11-02T10:00:00Z",
  },
  {
    id: "log_002",
    product_id: "prod_002",
    product_name: "Ergonomic Keyboard",
    sku: "ERGO-KEY-02",
    type: "adjustment",
    quantity: 12,
    reason: "Store launch stocking",
    timestamp: "2025-11-05T14:30:00Z",
  },
  {
    id: "log_003",
    product_id: "prod_003",
    product_name: "UltraWide Monitor",
    sku: "WIDE-MON-03",
    type: "out",
    quantity: 2,
    reason: "Fulfilled order INV-2025-001",
    timestamp: "2025-11-12T08:00:00Z",
  },
];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readProductsStore(): ProductRecord[] {
  if (!isBrowser()) {
    return SEED_PRODUCTS;
  }
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
  try {
    return JSON.parse(stored) as ProductRecord[];
  } catch {
    return SEED_PRODUCTS;
  }
}

function writeProductsStore(products: ProductRecord[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

function readLogsStore(): StockAdjustmentLog[] {
  if (!isBrowser()) {
    return SEED_LOGS;
  }
  const stored = localStorage.getItem(LOGS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(SEED_LOGS));
    return SEED_LOGS;
  }
  try {
    return JSON.parse(stored) as StockAdjustmentLog[];
  } catch {
    return SEED_LOGS;
  }
}

function writeLogsStore(logs: StockAdjustmentLog[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
}

function generateId(): string {
  return `prod_${Date.now().toString(36)}`;
}

function generateLogId(): string {
  return `log_${Date.now().toString(36)}`;
}

export function getAllProducts(): ProductRecord[] {
  return readProductsStore().sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
}

export function getProductById(id: string): ProductRecord | undefined {
  return readProductsStore().find((p) => p.id === id);
}

export function createProduct(data: ProductFormValues): ProductRecord {
  const now = new Date().toISOString();
  const product: ProductRecord = {
    id: generateId(),
    name: data.name,
    sku: data.sku,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    status: data.status,
    stock: Number(data.stock),
    min_stock_level: Number(data.min_stock_level),
    created_at: now,
    updated_at: now,
  };

  const products = readProductsStore();
  writeProductsStore([product, ...products]);

  // Log stock setup
  if (product.stock > 0) {
    addAdjustmentLog(
      product.id,
      product.name,
      product.sku,
      "adjustment",
      product.stock,
      "Initial stock value set",
    );
  }

  return product;
}

export function updateProduct(
  id: string,
  data: ProductFormValues,
): ProductRecord | undefined {
  const products = readProductsStore();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  const prevStock = products[index].stock;
  const newStock = Number(data.stock);

  const updated: ProductRecord = {
    ...products[index],
    name: data.name,
    sku: data.sku,
    description: data.description,
    price: Number(data.price),
    category: data.category,
    status: data.status,
    stock: newStock,
    min_stock_level: Number(data.min_stock_level),
    updated_at: new Date().toISOString(),
  };

  products[index] = updated;
  writeProductsStore(products);

  // Log stock adjustments if any
  if (newStock !== prevStock) {
    const diff = newStock - prevStock;
    addAdjustmentLog(
      updated.id,
      updated.name,
      updated.sku,
      diff > 0 ? "in" : "out",
      Math.abs(diff),
      "Product properties updated",
    );
  }

  return updated;
}

export function deleteProduct(id: string): boolean {
  const products = readProductsStore();
  const nextProducts = products.filter((p) => p.id !== id);
  if (nextProducts.length === products.length) return false;
  writeProductsStore(nextProducts);
  return true;
}

export function queryProducts(params: ProductQueryParams): ProductQueryResult {
  const { search = "", status = "all", page, pageSize } = params;
  const normalizedSearch = search.trim().toLowerCase();

  let filtered = getAllProducts();

  if (status !== "all") {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (normalizedSearch) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(normalizedSearch) ||
        p.sku.toLowerCase().includes(normalizedSearch) ||
        (p.category?.toLowerCase().includes(normalizedSearch) ?? false),
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    totalItems,
    totalPages,
    page: safePage,
    pageSize,
  };
}

export function adjustStock(
  productId: string,
  quantity: number,
  type: "in" | "out" | "adjustment",
  reason: string,
): ProductRecord | undefined {
  const products = readProductsStore();
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) return undefined;

  const product = products[index];
  let nextStock = product.stock;

  if (type === "in") {
    nextStock += quantity;
  } else if (type === "out") {
    nextStock = Math.max(0, nextStock - quantity);
  } else {
    nextStock = quantity;
  }

  const updated: ProductRecord = {
    ...product,
    stock: nextStock,
    updated_at: new Date().toISOString(),
  };

  products[index] = updated;
  writeProductsStore(products);

  addAdjustmentLog(
    product.id,
    product.name,
    product.sku,
    type,
    quantity,
    reason,
  );

  return updated;
}

export function getStockAdjustmentLogs(): StockAdjustmentLog[] {
  return readLogsStore().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

function addAdjustmentLog(
  productId: string,
  productName: string,
  sku: string,
  type: "in" | "out" | "adjustment",
  quantity: number,
  reason: string,
): void {
  const log: StockAdjustmentLog = {
    id: generateLogId(),
    product_id: productId,
    product_name: productName,
    sku,
    type,
    quantity,
    reason,
    timestamp: new Date().toISOString(),
  };

  const logs = readLogsStore();
  writeLogsStore([log, ...logs]);
}

export const PRODUCTS_PAGE_SIZE = 8;

export type ProductStats = {
  total: number;
  active: number;
  inactive: number;
  lowStock: number;
};

export type InventoryStats = {
  totalUnits: number;
  catalogItems: number;
  lowStock: number;
  adjustmentCount: number;
};

export function getProductStats(): ProductStats {
  const all = getAllProducts();

  return {
    total: all.length,
    active: all.filter((product) => product.status === "active").length,
    inactive: all.filter((product) => product.status === "inactive").length,
    lowStock: all.filter(
      (product) => product.stock <= (product.min_stock_level ?? 10),
    ).length,
  };
}

export function getInventoryStats(): InventoryStats {
  const all = getAllProducts();

  return {
    totalUnits: all.reduce((sum, product) => sum + product.stock, 0),
    catalogItems: all.length,
    lowStock: all.filter(
      (product) => product.stock <= (product.min_stock_level ?? 10),
    ).length,
    adjustmentCount: getStockAdjustmentLogs().length,
  };
}

export const CATEGORY_OPTIONS = [
  "Electronics",
  "Office Supplies",
  "Accessories",
  "Software",
  "Hardware",
  "Furniture",
  "Other",
];
