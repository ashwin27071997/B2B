import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers';
import { ROUTES } from '@/constants';
import type { CalendarDay, TimeSlot, UseConsultationBookingReturn } from './ConsultationBooking.types';

// Constants
const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const MORNING_SLOTS: TimeSlot[] = [
  { time: '09:30', label: '9:30 AM', available: true },
  { time: '10:30', label: '10:30 AM', available: false },
  { time: '11:30', label: '11:30 AM', available: true },
];

const AFTERNOON_SLOTS: TimeSlot[] = [
  { time: '12:30', label: '12:30 PM', available: true },
  { time: '14:30', label: '2:30 PM', available: true },
  { time: '15:30', label: '3:30 PM', available: true },
  { time: '16:30', label: '4:30 PM', available: true },
  { time: '17:30', label: '5:30 PM', available: true },
];

const TOPICS = [
  'Choosing a structure',
  'GST registration',
  'Import / export code',
  'MSME (Udyam)',
  'Trademark',
  'Funding readiness',
  'Hiring & payroll',
];

const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi'];

/**
 * Generate calendar days for August 2026
 * In production, this would be dynamic based on current date
 */
function generateCalendarDays(): CalendarDay[][] {
  const weeks: CalendarDay[][] = [];
  // August 2026 starts on Saturday (index 5)
  const firstDayOffset = 5;
  const daysInMonth = 31;

  let currentWeek: CalendarDay[] = [];

  // Add empty cells for days before the 1st
  for (let i = 0; i < firstDayOffset; i++) {
    currentWeek.push({ date: 0, hasSlots: false, fullyBooked: false, isWeekend: false, isPast: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = (firstDayOffset + day - 1) % 7;
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
    const isPast = day < 10; // Assuming today is the 10th
    const hasSlots = !isWeekend && !isPast && day !== 21;
    const fullyBooked = day === 21;

    currentWeek.push({ date: day, hasSlots, fullyBooked, isWeekend, isPast });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill remaining days of the last week
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({ date: 0, hasSlots: false, fullyBooked: false, isWeekend: false, isPast: false });
  }
  if (currentWeek.length === 7) {
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * Custom hook for ConsultationBooking page logic
 */
export function useConsultationBooking(): UseConsultationBookingReturn {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [selectedDate, setSelectedDate] = useState<number>(10);
  const [selectedSlot, setSelectedSlot] = useState<string>('11:30');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Choosing a structure']);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [language, setLanguage] = useState('English');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived values
  const calendarWeeks = useMemo(() => generateCalendarDays(), []);

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

  const selectedTimeLabel = useMemo(() => {
    const allSlots = [...MORNING_SLOTS, ...AFTERNOON_SLOTS];
    const slot = allSlots.find((s) => s.time === selectedSlot);
    if (!slot) return '';

    const [hours, minutes] = selectedSlot.split(':').map(Number);
    const endHours = minutes === 30 ? hours + 1 : hours;
    const endMinutes = minutes === 30 ? 0 : 30;
    const endPeriod = endHours >= 12 ? 'PM' : 'AM';
    const endHour12 = endHours > 12 ? endHours - 12 : endHours;
    return `${slot.label} – ${endHour12}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`;
  }, [selectedSlot]);

  const availableSlotsCount = useMemo(() => {
    return [...MORNING_SLOTS, ...AFTERNOON_SLOTS].filter((s) => s.available).length;
  }, []);

  // Handlers
  const handleBack = useCallback(() => {
    navigate(ROUTES.CONSULTATION_INTRO);
  }, [navigate]);

  const handleDateSelect = useCallback((date: number) => {
    setSelectedDate(date);
    setError(null);
  }, []);

  const handleSlotSelect = useCallback((time: string) => {
    setSelectedSlot(time);
    setError(null);
  }, []);

  const handleTopicToggle = useCallback((topic: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.filter((t) => t !== topic);
      }
      return [...prev, topic];
    });
    setError(null);
  }, []);

  const handlePhoneChange = useCallback((newPhone: string) => {
    setPhone(newPhone);
  }, []);

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selectedTopics.length === 0) {
      setError('Pick at least one thing for the advisor to prepare.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    navigate(ROUTES.CONSULTATION_CONFIRMED, {
      state: {
        date: selectedDate,
        month: 'August',
        year: 2026,
        dayOfWeek: 'Monday',
        timeSlot: selectedTimeLabel,
        phone,
        topics: selectedTopics,
      },
    });
  }, [selectedDate, selectedTopics, phone, selectedTimeLabel, navigate]);

  return {
    // User
    userInitials,
    userName,

    // State
    selectedDate,
    selectedSlot,
    selectedTopics,
    phone,
    language,
    isSubmitting,
    error,

    // Derived values
    calendarWeeks,
    selectedTimeLabel,
    availableSlotsCount,

    // Handlers
    handleBack,
    handleDateSelect,
    handleSlotSelect,
    handleTopicToggle,
    handlePhoneChange,
    handleLanguageChange,
    handleSubmit,

    // Constants
    morningSlots: MORNING_SLOTS,
    afternoonSlots: AFTERNOON_SLOTS,
    topics: TOPICS,
    languages: LANGUAGES,
    daysOfWeek: DAYS_OF_WEEK,
  };
}
