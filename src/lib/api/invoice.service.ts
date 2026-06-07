import { apiClient } from "./api";
import { ApiError } from "./errors";
import type { BackendEnvelope } from "./types/auth.types";
import type {
  ApiInvoice,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  Invoice,
  BackendInvoice,
  InvoiceListParams,
  InvoiceListPage,
  InvoiceListResult,
  UpdateInvoiceRequest,
} from "./types/invoice.types";
import { parseAuthResponse } from "./utils/auth-response";

const INVOICES_BASE = "/invoices";

class InvoiceService {
  async list(params: InvoiceListParams = {}): Promise<InvoiceListResult> {
    const page = params.page ? params.page - 1 : 0; // Backend is 0-indexed
    const size = params.size ?? 20;

    const queryParams: Record<string, any> = {
      page,
      size,
    };

    if (params.search?.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params.status) {
      queryParams.status = params.status;
    }
    if (params.startDate) {
      queryParams.startDate = params.startDate;
    }
    if (params.endDate) {
      queryParams.endDate = params.endDate;
    }

    const response = await apiClient.get<BackendEnvelope<InvoiceListPage>>(
      INVOICES_BASE,
      { params: queryParams },
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Invoices list response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return {
      items: data.content,
      page: data.page + 1,
      pageSize: data.size,
      totalItems: data.totalElements,
      totalPages: Math.max(1, data.totalPages),
      hasNext: data.hasNext,
      hasPrevious: data.hasPrevious,
    };
  }

  async getById(id: string): Promise<BackendInvoice> {
    const response = await apiClient.get<BackendEnvelope<BackendInvoice>>(
      `${INVOICES_BASE}/${id}`,
    );

    const { data } = parseAuthResponse(response);
    if (!data) {
      throw new ApiError("Invoice response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }
    return data;
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

  async update(id: string, payload: UpdateInvoiceRequest): Promise<BackendInvoice> {
    const response = await apiClient.put<BackendEnvelope<BackendInvoice>>(
      `${INVOICES_BASE}/${id}`,
      payload,
    );

    const { data } = parseAuthResponse(response);
    if (!data) {
      throw new ApiError("Invoice response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${INVOICES_BASE}/${id}`);
  }

  async send(id: string): Promise<BackendInvoice> {
    const response = await apiClient.post<BackendEnvelope<BackendInvoice>>(
      `${INVOICES_BASE}/${id}/send`,
    );

    const { data } = parseAuthResponse(response);
    if (!data) {
      throw new ApiError("Invoice response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }
    return data;
  }

  async cancel(id: string): Promise<BackendInvoice> {
    const response = await apiClient.patch<BackendEnvelope<BackendInvoice>>(
      `${INVOICES_BASE}/${id}/cancel`,
    );

    const { data } = parseAuthResponse(response);
    if (!data) {
      throw new ApiError("Invoice response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }
    return data;
  }

  async downloadPdf(id: string): Promise<Blob> {
    const response = await apiClient.get<Blob>(
      `${INVOICES_BASE}/${id}/download`,
      { responseType: "blob" },
    );

    return response.data;
  }
}

export const invoiceService = new InvoiceService();
