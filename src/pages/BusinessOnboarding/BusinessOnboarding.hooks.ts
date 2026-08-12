import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers';
import { ROUTES } from '@/constants';
import type { Business, UseBusinessOnboardingReturn } from './BusinessOnboarding.types';

/**
 * Mock data for existing businesses found on PAN & mobile
 * In production, this would come from an API via React Query
 */
const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Vaayu Infra Solutions Pvt Ltd',
    initials: 'VI',
    meta: '29ABCDE1234F1Z5 · Private Limited · Bengaluru',
    status: 'verified',
    gstin: '29ABCDE1234F1Z5',
  },
  {
    id: '2',
    name: 'Meridian Textiles LLP',
    initials: 'MT',
    meta: '27FGHIJ5678K1Z2 · LLP · Pune',
    status: 'draft',
    gstin: '27FGHIJ5678K1Z2',
  },
  {
    id: '3',
    name: 'Sundara Traders & Agencies',
    initials: 'ST',
    meta: '33LMNOP9012Q1Z9 · Proprietorship · Coimbatore',
    status: 'action',
    gstin: '33LMNOP9012Q1Z9',
  },
];

/**
 * Custom hook for BusinessOnboarding page logic
 * Encapsulates all state, derived values, and handlers
 */
export function useBusinessOnboarding(): UseBusinessOnboardingReturn {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Derived user values
  const userInitials = useMemo(() => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'AR';
  }, [user?.email]);

  const userName = useMemo(() => {
    if (user?.fullName) {
      return user.fullName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  }, [user?.fullName, user?.email]);

  // Navigation handlers
  const handleBookConsultation = useCallback(() => {
    navigate(ROUTES.CONSULTATION_INTRO);
  }, [navigate]);

  const handleEnterBusiness = useCallback(() => {
    // TODO: Navigate to existing business flow
    console.log('Enter different business clicked');
  }, []);

  const handleNoGst = useCallback(() => {
    // TODO: Navigate to no GST flow
    console.log('No GST clicked');
  }, []);

  const handleSelectBusiness = useCallback((businessId: string) => {
    // TODO: Navigate to business details flow
    console.log('Selected business:', businessId);
  }, []);

  return {
    userInitials,
    userName,
    handleBookConsultation,
    handleEnterBusiness,
    handleNoGst,
    handleSelectBusiness,
    businesses: MOCK_BUSINESSES,
  };
}
