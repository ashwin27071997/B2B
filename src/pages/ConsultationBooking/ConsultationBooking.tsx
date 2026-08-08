import { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers';
import { ROUTES } from '@/constants';
import styles from './ConsultationBooking.module.css';

// Types
interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
}

interface CalendarDay {
  date: number;
  hasSlots: boolean;
  fullyBooked: boolean;
  isWeekend: boolean;
  isPast: boolean;
}

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

// Mock calendar data for August 2026
const generateCalendarDays = (): CalendarDay[][] => {
  const weeks: CalendarDay[][] = [];
  // August 2026 starts on Saturday (index 5), so we need 5 empty cells
  const firstDayOffset = 5;
  const daysInMonth = 31;

  let currentWeek: CalendarDay[] = [];

  // Add empty cells for days before the 1st
  for (let i = 0; i < firstDayOffset; i++) {
    currentWeek.push({ date: 0, hasSlots: false, fullyBooked: false, isWeekend: false, isPast: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = (firstDayOffset + day - 1) % 7;
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Saturday or Sunday
    const isPast = day < 10; // Assuming today is the 10th
    const hasSlots = !isWeekend && !isPast && day !== 21; // Day 21 is fully booked
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
};

// Memoized components
const BackgroundEffects = memo(() => (
  <div className={styles.backgroundEffects}>
    <div className={styles.glowIndigo} />
    <div className={styles.glowCyan} />
  </div>
));
BackgroundEffects.displayName = 'BackgroundEffects';

const BackArrowIcon = memo(() => (
  <svg width="14" height="12" viewBox="0 0 14 12">
    <path
      d="M6 1L1 6l5 5M1 6h12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
BackArrowIcon.displayName = 'BackArrowIcon';

const ChevronLeftIcon = memo(() => (
  <svg width="8" height="13" viewBox="0 0 9 15">
    <path d="M7.5 1.5l-6 6 6 6" fill="none" stroke="#EEF0FA" strokeWidth="2" strokeLinecap="round" />
  </svg>
));
ChevronLeftIcon.displayName = 'ChevronLeftIcon';

const ChevronRightIcon = memo(() => (
  <svg width="8" height="13" viewBox="0 0 9 15">
    <path d="M1.5 1.5l6 6-6 6" fill="none" stroke="#EEF0FA" strokeWidth="2" strokeLinecap="round" />
  </svg>
));
ChevronRightIcon.displayName = 'ChevronRightIcon';

export const ConsultationBooking = memo(() => {
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

  // Memoized values
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
    // Calculate end time (30 min later)
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

    // Navigate to confirmation screen with booking details
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
  }, [selectedDate, selectedSlot, selectedTopics, phone, selectedTimeLabel, navigate]);

  return (
    <div className={styles.container}>
      <BackgroundEffects />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoIcon}>L</div>
        <span className={styles.logoText}>Ledgerline</span>
        <div className={styles.headerDivider} />
        <span className={styles.headerLabel}>BUSINESS ONBOARDING</span>
        <div className={styles.headerSpacer} />
        <div className={styles.userPill}>
          <div className={styles.userAvatar}>{userInitials}</div>
          <span className={styles.userName}>{userName}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Back Button */}
          <button type="button" className={styles.backButton} onClick={handleBack}>
            <BackArrowIcon />
            <span>Back to options</span>
          </button>

          {/* Layout Grid */}
          <div className={styles.layoutGrid}>
            {/* Left Column - Calendar */}
            <div className={styles.leftColumn}>
              <h1 className={styles.headline}>Pick a date and time.</h1>
              <p className={styles.subheadline}>
                Thirty minutes with a registration advisor — structure, licences, timeline and a
                fixed quote.
              </p>

              {/* Calendar Card */}
              <div className={styles.calendarCard}>
                <div className={styles.calendarHeader}>
                  <span className={styles.monthLabel}>August 2026</span>
                  <button type="button" className={styles.navButton} disabled>
                    <ChevronLeftIcon />
                  </button>
                  <button type="button" className={styles.navButton}>
                    <ChevronRightIcon />
                  </button>
                </div>

                {/* Days Header */}
                <div className={styles.calendarDaysHeader}>
                  {DAYS_OF_WEEK.map((day, i) => (
                    <div key={i} className={styles.dayHeaderCell}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Weeks */}
                <div className={styles.calendarWeeks}>
                  {calendarWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className={styles.calendarWeek}>
                      {week.map((day, dayIndex) => {
                        if (day.date === 0) {
                          return <div key={dayIndex} className={`${styles.dayCell} ${styles.dayCellEmpty}`} />;
                        }

                        const isSelected = day.date === selectedDate;
                        const isDisabled = day.isPast || day.isWeekend;
                        const isToday = day.date === 8;

                        let cellClass = styles.dayCell;
                        if (isSelected) cellClass += ` ${styles.dayCellSelected}`;
                        if (isDisabled) cellClass += ` ${styles.dayCellDisabled}`;
                        if (day.hasSlots) cellClass += ` ${styles.dayCellHasSlots}`;
                        if (day.fullyBooked) cellClass += ` ${styles.dayCellFullyBooked}`;
                        if (isToday) cellClass += ` ${styles.dayCellToday}`;

                        return (
                          <button
                            key={dayIndex}
                            type="button"
                            className={cellClass}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && handleDateSelect(day.date)}
                          >
                            <span>{day.date}</span>
                            {isToday && <span className={styles.dayCellTodayLabel}>TODAY</span>}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className={styles.calendarLegend}>
                  <div className={styles.legendItem}>
                    <span className={styles.legendDotOpen} />
                    <span>Slots open</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={styles.legendDotBooked} />
                    <span>Fully booked</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span>Weekends closed</span>
                  </div>
                </div>
              </div>

              {/* Timezone Info */}
              <div className={styles.timezoneInfo}>
                <span className={styles.timezoneBadge}>IST</span>
                <span className={styles.timezoneText}>
                  Asia/Kolkata (GMT+5:30) — detected from your number
                </span>
              </div>
            </div>

            {/* Right Column - Booking Details */}
            <div className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <div className={styles.bookingHeaderLeft}>
                  <h2>Monday {selectedDate} August 2026</h2>
                  <p>
                    30-minute call · {availableSlotsCount} of 8 slots free · all times IST
                  </p>
                </div>
                {selectedSlot && (
                  <span className={styles.selectedTimeBadge}>{selectedTimeLabel}</span>
                )}
              </div>

              {/* Morning Slots */}
              <div className={styles.slotsSection}>
                <div className={styles.slotsLabel}>MORNING</div>
                <div className={styles.slotsGrid}>
                  {MORNING_SLOTS.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      className={`${styles.slotButton} ${selectedSlot === slot.time ? styles.slotButtonSelected : ''}`}
                      disabled={!slot.available}
                      onClick={() => handleSlotSelect(slot.time)}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon Slots */}
              <div className={styles.slotsSection}>
                <div className={styles.slotsLabel}>AFTERNOON</div>
                <div className={styles.slotsGrid}>
                  {AFTERNOON_SLOTS.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      className={`${styles.slotButton} ${selectedSlot === slot.time ? styles.slotButtonSelected : ''}`}
                      disabled={!slot.available}
                      onClick={() => handleSlotSelect(slot.time)}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className={styles.topicsSection}>
                <div className={styles.slotsLabel}>WHAT SHOULD THE ADVISOR PREPARE FOR?</div>
                <div className={styles.topicsGrid}>
                  {TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      className={`${styles.topicButton} ${selectedTopics.includes(topic) ? styles.topicButtonSelected : ''}`}
                      onClick={() => handleTopicToggle(topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className={styles.formFields}>
                <div className={styles.formField}>
                  <label htmlFor="phone">Mobile for the call</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className={styles.errorMessage}>
                  <span className={styles.errorDot} />
                  <span className={styles.errorText}>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                className={styles.submitButton}
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting && <span className={styles.spinner} />}
                <span>Confirm consultation</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});

ConsultationBooking.displayName = 'ConsultationBooking';
