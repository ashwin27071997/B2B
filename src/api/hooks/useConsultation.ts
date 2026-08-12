import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as consultationApi from '../endpoints/consultation';
import type {
  PaginationParams,
  BookConsultationRequest,
  RescheduleConsultationRequest,
} from '../types';

// Query keys
export const consultationKeys = {
  all: ['consultations'] as const,
  lists: () => [...consultationKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...consultationKeys.lists(), params] as const,
  details: () => [...consultationKeys.all, 'detail'] as const,
  detail: (id: string) => [...consultationKeys.details(), id] as const,
  slots: (startDate: string, endDate: string) =>
    [...consultationKeys.all, 'slots', startDate, endDate] as const,
};

// Get all consultations
export function useConsultations(params?: PaginationParams) {
  return useQuery({
    queryKey: consultationKeys.list(params),
    queryFn: () => consultationApi.getConsultations(params),
  });
}

// Get single consultation
export function useConsultation(id: string) {
  return useQuery({
    queryKey: consultationKeys.detail(id),
    queryFn: () => consultationApi.getConsultation(id),
    enabled: !!id,
  });
}

// Get available slots
export function useAvailableSlots(startDate: string, endDate: string) {
  return useQuery({
    queryKey: consultationKeys.slots(startDate, endDate),
    queryFn: () => consultationApi.getAvailableSlots(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

// Book consultation mutation
export function useBookConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookConsultationRequest) =>
      consultationApi.bookConsultation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.lists() });
    },
  });
}

// Reschedule consultation mutation
export function useRescheduleConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RescheduleConsultationRequest) =>
      consultationApi.rescheduleConsultation(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: consultationKeys.detail(variables.consultationId),
      });
      queryClient.invalidateQueries({ queryKey: consultationKeys.lists() });
    },
  });
}

// Cancel consultation mutation
export function useCancelConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      consultationApi.cancelConsultation(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: consultationKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: consultationKeys.lists() });
    },
  });
}

// Confirm consultation mutation
export function useConfirmConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => consultationApi.confirmConsultation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: consultationKeys.lists() });
    },
  });
}
