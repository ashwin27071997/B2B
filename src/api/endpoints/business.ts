import { get, post, put, del } from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Business,
  CreateBusinessRequest,
  BusinessRegistrationStep,
  BusinessDocument,
} from '../types';

const BASE_PATH = '/business';

// Get all businesses for current user
export function getBusinesses(params?: PaginationParams) {
  return get<PaginatedResponse<Business>>(BASE_PATH, { params });
}

// Get single business by ID
export function getBusiness(id: string) {
  return get<ApiResponse<Business>>(`${BASE_PATH}/${id}`);
}

// Create new business registration
export function createBusiness(data: CreateBusinessRequest) {
  return post<ApiResponse<Business>>(BASE_PATH, data);
}

// Update business
export function updateBusiness(id: string, data: Partial<CreateBusinessRequest>) {
  return put<ApiResponse<Business>>(`${BASE_PATH}/${id}`, data);
}

// Delete business (draft only)
export function deleteBusiness(id: string) {
  return del<ApiResponse<{ success: boolean }>>(`${BASE_PATH}/${id}`);
}

// Get registration steps for a business
export function getRegistrationSteps(businessId: string) {
  return get<ApiResponse<BusinessRegistrationStep[]>>(
    `${BASE_PATH}/${businessId}/steps`
  );
}

// Get documents for a business
export function getBusinessDocuments(businessId: string) {
  return get<ApiResponse<BusinessDocument[]>>(
    `${BASE_PATH}/${businessId}/documents`
  );
}

// Upload document
export function uploadDocument(
  businessId: string,
  documentType: string,
  file: File
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', documentType);

  return post<ApiResponse<BusinessDocument>>(
    `${BASE_PATH}/${businessId}/documents`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

// Delete document
export function deleteDocument(businessId: string, documentId: string) {
  return del<ApiResponse<{ success: boolean }>>(
    `${BASE_PATH}/${businessId}/documents/${documentId}`
  );
}
