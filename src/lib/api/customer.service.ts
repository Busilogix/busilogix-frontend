import { apiClient } from "./api";
import { ApiError } from "./errors";
import type { BackendEnvelope } from "./types/auth.types";
import type {
  ApiCustomer,
  ApiCustomerStats,
  CreateCustomerRequest,
  CreateCustomerResponse,
  CustomerCatalogStats,
  CustomerListPage,
  CustomerListParams,
  CustomerListResult,
  CustomerMobileLookupResult,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
} from "./types/customer.types";
import { parseAuthResponse } from "./utils/auth-response";
import { buildCustomerListQuery } from "./utils/customer-query";

const CUSTOMERS_BASE = "/customers";

class CustomerService {
  async list(params: CustomerListParams = {}): Promise<CustomerListResult> {
    const response = await apiClient.get<BackendEnvelope<CustomerListPage>>(
      CUSTOMERS_BASE,
      { params: buildCustomerListQuery(params) },
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Customers response did not include data.", {
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

  async getStats(): Promise<CustomerCatalogStats> {
    const response = await apiClient.get<BackendEnvelope<ApiCustomerStats>>(
      `${CUSTOMERS_BASE}/stats`,
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Customer statistics response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return {
      total: data.totalCustomers,
      addedThisYear: data.addedThisYear,
      addedThisMonth: data.addedThisMonth,
      addedThisWeek: data.addedThisWeek,
    };
  }

  async lookupByMobile(mobile: string): Promise<CustomerMobileLookupResult> {
    const response = await apiClient.get<
      BackendEnvelope<CustomerMobileLookupResult>
    >(`${CUSTOMERS_BASE}/mobile/${encodeURIComponent(mobile.trim())}`);

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Customer lookup response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return data;
  }

  async getById(id: string): Promise<ApiCustomer> {
    const response = await apiClient.get<BackendEnvelope<ApiCustomer>>(
      `${CUSTOMERS_BASE}/${id}`,
    );

    const { data } = parseAuthResponse(response);

    if (!data) {
      throw new ApiError("Customer response did not include data.", {
        statusCode: response.status,
        errorCode: "INVALID_RESPONSE",
      });
    }

    return data;
  }

  async create(
    payload: CreateCustomerRequest,
  ): Promise<CreateCustomerResponse> {
    const response = await apiClient.post<BackendEnvelope>(
      `${CUSTOMERS_BASE}/create`,
      payload,
    );

    const { message } = parseAuthResponse(response);

    return { message };
  }

  async update(
    id: string,
    payload: UpdateCustomerRequest,
  ): Promise<UpdateCustomerResponse> {
    const response = await apiClient.put<BackendEnvelope>(
      `${CUSTOMERS_BASE}/${id}`,
      payload,
    );

    const { message } = parseAuthResponse(response);

    return { message };
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${CUSTOMERS_BASE}/${id}`);
  }
}

export const customerService = new CustomerService();
