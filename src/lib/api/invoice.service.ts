import { apiClient } from "./api";
import type { ApiResponse, PaginatedApiResponse } from "./types/api.types";
import type {
  CreateInvoiceRequest,
  Invoice,
  InvoiceListParams,
  UpdateInvoiceRequest,
} from "./types/invoice.types";
import { unwrapApiResponse } from "./utils/response";

const INVOICES_BASE = "/invoices";

class InvoiceService {
  async list(params?: InvoiceListParams): Promise<Invoice[]> {
    const response = await apiClient.get<PaginatedApiResponse<Invoice>>(
      INVOICES_BASE,
      { params },
    );

    return response.data.data;
  }

  async getById(id: string): Promise<Invoice> {
    const response = await apiClient.get<ApiResponse<Invoice>>(
      `${INVOICES_BASE}/${id}`,
    );

    return unwrapApiResponse(response);
  }

  async create(payload: CreateInvoiceRequest): Promise<Invoice> {
    const response = await apiClient.post<ApiResponse<Invoice>>(
      INVOICES_BASE,
      payload,
    );

    return unwrapApiResponse(response);
  }

  async update(id: string, payload: UpdateInvoiceRequest): Promise<Invoice> {
    const response = await apiClient.put<ApiResponse<Invoice>>(
      `${INVOICES_BASE}/${id}`,
      payload,
    );

    return unwrapApiResponse(response);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${INVOICES_BASE}/${id}`);
  }

  async send(id: string): Promise<Invoice> {
    const response = await apiClient.post<ApiResponse<Invoice>>(
      `${INVOICES_BASE}/${id}/send`,
    );

    return unwrapApiResponse(response);
  }
}

export const invoiceService = new InvoiceService();
