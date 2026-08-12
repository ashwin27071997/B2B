import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as businessApi from '../endpoints/business';
import type {
  PaginationParams,
  CreateBusinessRequest,
  Business,
} from '../types';

// Query keys
export const businessKeys = {
  all: ['businesses'] as const,
  lists: () => [...businessKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...businessKeys.lists(), params] as const,
  details: () => [...businessKeys.all, 'detail'] as const,
  detail: (id: string) => [...businessKeys.details(), id] as const,
  steps: (id: string) => [...businessKeys.detail(id), 'steps'] as const,
  documents: (id: string) => [...businessKeys.detail(id), 'documents'] as const,
};

// Get all businesses
export function useBusinesses(params?: PaginationParams) {
  return useQuery({
    queryKey: businessKeys.list(params),
    queryFn: () => businessApi.getBusinesses(params),
  });
}

// Get single business
export function useBusiness(id: string) {
  return useQuery({
    queryKey: businessKeys.detail(id),
    queryFn: () => businessApi.getBusiness(id),
    enabled: !!id,
  });
}

// Get registration steps
export function useRegistrationSteps(businessId: string) {
  return useQuery({
    queryKey: businessKeys.steps(businessId),
    queryFn: () => businessApi.getRegistrationSteps(businessId),
    enabled: !!businessId,
  });
}

// Get business documents
export function useBusinessDocuments(businessId: string) {
  return useQuery({
    queryKey: businessKeys.documents(businessId),
    queryFn: () => businessApi.getBusinessDocuments(businessId),
    enabled: !!businessId,
  });
}

// Create business mutation
export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBusinessRequest) => businessApi.createBusiness(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
}

// Update business mutation
export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateBusinessRequest>;
    }) => businessApi.updateBusiness(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: businessKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
}

// Delete business mutation
export function useDeleteBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => businessApi.deleteBusiness(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
}

// Upload document mutation
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      documentType,
      file,
    }: {
      businessId: string;
      documentType: string;
      file: File;
    }) => businessApi.uploadDocument(businessId, documentType, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: businessKeys.documents(variables.businessId),
      });
    },
  });
}

// Delete document mutation
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      documentId,
    }: {
      businessId: string;
      documentId: string;
    }) => businessApi.deleteDocument(businessId, documentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: businessKeys.documents(variables.businessId),
      });
    },
  });
}

// Optimistic update helper for business
export function useOptimisticBusinessUpdate() {
  const queryClient = useQueryClient();

  return {
    setBusinessData: (id: string, updater: (old: Business | undefined) => Business) => {
      queryClient.setQueryData(businessKeys.detail(id), (old: { data: Business } | undefined) => {
        if (!old) return old;
        return { ...old, data: updater(old.data) };
      });
    },
  };
}
