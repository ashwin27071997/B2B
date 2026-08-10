import { memo, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers';
import { ROUTES } from '@/constants';
import styles from './ConsultationConfirmed.module.css';

// Types
interface BookingDetails {
  date: number;
  month: string;
  year: number;
  dayOfWeek: string;
  timeSlot: string;
  phone: string;
  topics: string[];
}

// Mock advisor data
const ADVISOR = {
  initials: 'PN',
  name: 'Priya Nandakumar',
  role: 'Pvt Ltd & LLP specialist',
};

// Memoized components
const BackgroundEffects = memo(() => (
  <div className={styles.backgroundEffects}>
    <div className={styles.glowIndigo} />
    <div className={styles.glowCyan} />
  </div>
));
BackgroundEffects.displayName = 'BackgroundEffects';

const CheckmarkIcon = memo(() => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M8 17L13 22L24 10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
CheckmarkIcon.displayName = 'CheckmarkIcon';

const CalendarIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 7H16" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
));
CalendarIcon.displayName = 'CalendarIcon';

const PhoneIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M16.5 12.69v2.25a1.5 1.5 0 01-1.64 1.5 14.85 14.85 0 01-6.47-2.3 14.63 14.63 0 01-4.5-4.5 14.85 14.85 0 01-2.3-6.5 1.5 1.5 0 011.49-1.64h2.25a1.5 1.5 0 011.5 1.29c.1.72.27 1.43.52 2.1a1.5 1.5 0 01-.34 1.58L5.89 7.59a12 12 0 004.5 4.5l1.12-1.12a1.5 1.5 0 011.58-.34c.68.25 1.38.43 2.1.52a1.5 1.5 0 011.31 1.54z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
PhoneIcon.displayName = 'PhoneIcon';

const ListIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M6 4.5H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 9H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 13.5H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="2.5" cy="4.5" r="1" fill="currentColor" />
    <circle cx="2.5" cy="9" r="1" fill="currentColor" />
    <circle cx="2.5" cy="13.5" r="1" fill="currentColor" />
  </svg>
));
ListIcon.displayName = 'ListIcon';

export const ConsultationConfirmed = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get booking details from navigation state or use defaults
  const bookingDetails = useMemo<BookingDetails>(() => {
    const state = location.state as Partial<BookingDetails> | undefined;
    return {
      date: state?.date ?? 10,
      month: state?.month ?? 'August',
      year: state?.year ?? 2026,
      dayOfWeek: state?.dayOfWeek ?? 'Monday',
      timeSlot: state?.timeSlot ?? '11:30 AM – 12:00 PM',
      phone: state?.phone ?? '+91 98765 43210',
      topics: state?.topics ?? ['Choosing a structure'],
    };
  }, [location.state]);

  // Memoized user display values
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

  // Format the full date string
  const formattedDate = useMemo(() => {
    return `${bookingDetails.dayOfWeek} ${bookingDetails.date} ${bookingDetails.month} ${bookingDetails.year}`;
  }, [bookingDetails]);

  // Navigation handlers
  const handleTrackRegistration = useCallback(() => {
    navigate(ROUTES.DASHBOARD);
  }, [navigate]);

  const handleChangeSlot = useCallback(() => {
    navigate(ROUTES.CONSULTATION_BOOKING);
  }, [navigate]);

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
          {/* Success Card */}
          <div className={styles.successCard}>
            {/* Success Icon */}
            <div className={styles.successIcon}>
              <CheckmarkIcon />
            </div>

            {/* Headline */}
            <h1 className={styles.headline}>Your advisor call is booked.</h1>
            <p className={styles.subheadline}>
              We've sent a calendar invite and an SMS confirmation to your phone.
            </p>

            {/* Booking Details Card */}
            <div className={styles.detailsCard}>
              {/* Advisor Section */}
              <div className={styles.advisorSection}>
                <div className={styles.advisorAvatar}>{ADVISOR.initials}</div>
                <div className={styles.advisorInfo}>
                  <span className={styles.advisorName}>{ADVISOR.name}</span>
                  <span className={styles.advisorRole}>{ADVISOR.role}</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className={styles.detailsGrid}>
                {/* Date & Time */}
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <CalendarIcon />
                  </div>
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>DATE & TIME</span>
                    <span className={styles.detailValue}>{formattedDate}</span>
                    <span className={styles.detailSubvalue}>{bookingDetails.timeSlot} IST</span>
                  </div>
                </div>

                {/* Phone */}
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <PhoneIcon />
                  </div>
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>WE'LL CALL</span>
                    <span className={styles.detailValue}>{bookingDetails.phone}</span>
                  </div>
                </div>

                {/* Topics */}
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <ListIcon />
                  </div>
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>ADVISOR AGENDA</span>
                    <span className={styles.detailValue}>
                      {bookingDetails.topics.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleTrackRegistration}
              >
                Track the registration
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleChangeSlot}
              >
                Change slot
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});

ConsultationConfirmed.displayName = 'ConsultationConfirmed';
