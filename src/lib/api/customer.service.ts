import { apiClient } from "./api";
import type { ApiResponse, PaginatedApiResponse } from "./types/api.types";
import type {
  CreateCustomerRequest,
  Customer,
  CustomerListParams,
  UpdateCustomerRequest,
} from "./types/customer.types";
import { unwrapApiResponse } from "./utils/response";

const CUSTOMERS_BASE = "/customers";

class CustomerService {
  async list(params?: CustomerListParams): Promise<Customer[]> {
    const response = await apiClient.get<PaginatedApiResponse<Customer>>(
      CUSTOMERS_BASE,
      { params },
    );

    return response.data.data;
  }

  async getById(id: string): Promise<Customer> {
    const response = await apiClient.get<ApiResponse<Customer>>(
      `${CUSTOMERS_BASE}/${id}`,
    );

    return unwrapApiResponse(response);
  }

  async create(payload: CreateCustomerRequest): Promise<Customer> {
    const response = await apiClient.post<ApiResponse<Customer>>(
      CUSTOMERS_BASE,
      payload,
    );

    return unwrapApiResponse(response);
  }

  async update(id: string, payload: UpdateCustomerRequest): Promise<Customer> {
    const response = await apiClient.put<ApiResponse<Customer>>(
      `${CUSTOMERS_BASE}/${id}`,
      payload,
    );

    return unwrapApiResponse(response);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${CUSTOMERS_BASE}/${id}`);
  }
}

export const customerService = new CustomerService();
