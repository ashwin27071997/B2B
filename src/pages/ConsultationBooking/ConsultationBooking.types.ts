/**
 * ConsultationBooking Types
 */

export interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

export interface CalendarDay {
  date: number;
  hasSlots: boolean;
  fullyBooked: boolean;
  isWeekend: boolean;
  isPast: boolean;
}

export interface BookingState {
  selectedDate: number;
  selectedSlot: string;
  selectedTopics: string[];
  phone: string;
  language: string;
  isSubmitting: boolean;
  error: string | null;
}

export interface BookingConfirmationData {
  date: number;
  month: string;
  year: number;
  dayOfWeek: string;
  timeSlot: string;
  phone: string;
  topics: string[];
}

export interface UseConsultationBookingReturn {
  // User
  userInitials: string;
  userName: string;

  // State
  selectedDate: number;
  selectedSlot: string;
  selectedTopics: string[];
  phone: string;
  language: string;
  isSubmitting: boolean;
  error: string | null;

  // Derived values
  calendarWeeks: CalendarDay[][];
  selectedTimeLabel: string;
  availableSlotsCount: number;

  // Handlers
  handleBack: () => void;
  handleDateSelect: (date: number) => void;
  handleSlotSelect: (time: string) => void;
  handleTopicToggle: (topic: string) => void;
  handlePhoneChange: (phone: string) => void;
  handleLanguageChange: (language: string) => void;
  handleSubmit: () => Promise<void>;

  // Constants
  morningSlots: TimeSlot[];
  afternoonSlots: TimeSlot[];
  topics: string[];
  languages: string[];
  daysOfWeek: string[];
}
