// Consultation-related API types

export interface Consultation {
  id: string;
  businessId?: string;
  userId: string;
  scheduledAt: string;
  duration: number; // in minutes
  status: ConsultationStatus;
  meetingLink?: string;
  notes?: string;
  assignedTo?: ConsultationAdvisor;
  createdAt: string;
  updatedAt: string;
}

export type ConsultationStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface ConsultationAdvisor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title: string;
}

export interface AvailableSlot {
  date: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface BookConsultationRequest {
  date: string;
  startTime: string;
  endTime: string;
  businessType?: string;
  notes?: string;
}

export interface RescheduleConsultationRequest {
  consultationId: string;
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  reason?: string;
}
