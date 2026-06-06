import { apiClient } from "./api";
import { ApiError } from "./errors";
import type { BackendEnvelope } from "./types/auth.types";
import type {
  ApiInvoice,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  Invoice,
  InvoiceListParams,
  UpdateInvoiceRequest,
} from "./types/invoice.types";
import { parseAuthResponse } from "./utils/auth-response";
import type { ApiResponse, PaginatedApiResponse } from "./types/api.types";
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

  async create(payload: CreateInvoiceRequest): Promise<CreateInvoiceResponse> {
    const response = await apiClient.post<BackendEnvelope<ApiInvoice>>(
      INVOICES_BASE,
      payload,
    );

    const { message, data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Invoice response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return { message, invoice: data };
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
