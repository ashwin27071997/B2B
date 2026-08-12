import { get, post, put } from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Consultation,
  AvailableSlot,
  BookConsultationRequest,
  RescheduleConsultationRequest,
} from '../types';

const BASE_PATH = '/consultations';

// Get all consultations for current user
export function getConsultations(params?: PaginationParams) {
  return get<PaginatedResponse<Consultation>>(BASE_PATH, { params });
}

// Get single consultation by ID
export function getConsultation(id: string) {
  return get<ApiResponse<Consultation>>(`${BASE_PATH}/${id}`);
}

// Get available slots for booking
export function getAvailableSlots(startDate: string, endDate: string) {
  return get<ApiResponse<AvailableSlot[]>>(`${BASE_PATH}/slots`, {
    params: { startDate, endDate },
  });
}

// Book a new consultation
export function bookConsultation(data: BookConsultationRequest) {
  return post<ApiResponse<Consultation>>(BASE_PATH, data);
}

// Reschedule consultation
export function rescheduleConsultation(data: RescheduleConsultationRequest) {
  return put<ApiResponse<Consultation>>(
    `${BASE_PATH}/${data.consultationId}/reschedule`,
    data
  );
}

// Cancel consultation
export function cancelConsultation(id: string, reason?: string) {
  return put<ApiResponse<Consultation>>(`${BASE_PATH}/${id}/cancel`, {
    reason,
  });
}

// Confirm consultation (after receiving reminder)
export function confirmConsultation(id: string) {
  return put<ApiResponse<Consultation>>(`${BASE_PATH}/${id}/confirm`);
}
