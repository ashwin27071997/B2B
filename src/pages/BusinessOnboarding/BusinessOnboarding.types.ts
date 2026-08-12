/**
 * BusinessOnboarding Types
 */

export type BusinessStatus = 'verified' | 'draft' | 'action';

export interface Business {
  id: string;
  name: string;
  initials: string;
  meta: string;
  status: BusinessStatus;
  gstin: string;
}

export interface BusinessOnboardingProps {
  // Reserved for future props when component needs external data
}

export interface UseBusinessOnboardingReturn {
  // User
  userInitials: string;
  userName: string;

  // Handlers
  handleBookConsultation: () => void;
  handleEnterBusiness: () => void;
  handleNoGst: () => void;
  handleSelectBusiness: (businessId: string) => void;

  // Data
  businesses: Business[];
}
