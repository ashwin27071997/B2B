import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers';
import { ROUTES } from '@/constants';
import styles from './ConsultationIntro.module.css';

// Mock data for advisor and next available slot
const ADVISOR = {
  initials: 'PN',
  name: 'Priya Nandakumar',
  role: 'Your advisor · 9 yrs · Pvt Ltd & LLP specialist',
};

const NEXT_FREE_SLOT = 'Mon 10 Aug, from 9:30 AM IST';

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

export const ConsultationIntro = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Navigation handlers
  const handleBack = useCallback(() => {
    navigate(ROUTES.BUSINESS_ONBOARDING);
  }, [navigate]);

  const handleSeeSlots = useCallback(() => {
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
          {/* Back Button */}
          <button type="button" className={styles.backButton} onClick={handleBack}>
            <BackArrowIcon />
            <span>Back to options</span>
          </button>

          {/* Layout Grid */}
          <div className={styles.layoutGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {/* Status Badge */}
              <div className={styles.statusBadge}>
                <span className={styles.statusDot} />
                <span>1,400+ businesses registered through Ledgerline</span>
              </div>

              {/* Headlines */}
              <h1 className={styles.headline}>
                Want to start a new business? We've got you covered.
              </h1>
              <p className={styles.subheadline}>
                You don't need to know what a SPICe+ form is, or which structure suits you. Book a
                call — an advisor asks about the work you do and handles the paperwork end to end.
              </p>

              {/* Feature Grid */}
              <div className={styles.featureGrid}>
                <div className={styles.featureCard}>
                  <div className={`${styles.featureIcon} ${styles.featureIconPrimary}`} />
                  <span className={styles.featureText}>We pick the structure with you</span>
                </div>
                <div className={styles.featureCard}>
                  <div className={`${styles.featureIcon} ${styles.featureIconSecondary}`} />
                  <span className={styles.featureText}>Licences mapped to your state</span>
                </div>
                <div className={styles.featureCard}>
                  <div className={`${styles.featureIcon} ${styles.featureIconPrimary}`} />
                  <span className={styles.featureText}>We file it — you sign, that's all</span>
                </div>
                <div className={styles.featureCard}>
                  <div className={`${styles.featureIcon} ${styles.featureIconSecondary}`} />
                  <span className={styles.featureText}>Fixed quote before anything is paid</span>
                </div>
              </div>
            </div>

            {/* Right Column - Advisor Card */}
            <div className={styles.advisorCard}>
              {/* Advisor Header */}
              <div className={styles.advisorHeader}>
                <div className={styles.advisorAvatar}>{ADVISOR.initials}</div>
                <div className={styles.advisorInfo}>
                  <span className={styles.advisorName}>{ADVISOR.name}</span>
                  <span className={styles.advisorRole}>{ADVISOR.role}</span>
                </div>
              </div>

              {/* Steps List */}
              <div className={styles.stepsList}>
                <div className={styles.stepItem}>
                  <span className={`${styles.stepNumber} ${styles.stepNumberPrimary}`}>1</span>
                  <span className={styles.stepText}>
                    Pick a slot — 30 minutes, on the phone, in your language.
                  </span>
                </div>
                <div className={styles.stepItem}>
                  <span className={`${styles.stepNumber} ${styles.stepNumberPrimary}`}>2</span>
                  <span className={styles.stepText}>
                    Priya sends a 6-item document checklist before the call.
                  </span>
                </div>
                <div className={styles.stepItem}>
                  <span className={`${styles.stepNumber} ${styles.stepNumberSecondary}`}>3</span>
                  <span className={styles.stepText}>
                    We file, and the new company lands on your ledger.
                  </span>
                </div>
              </div>

              {/* Next Free Slot */}
              <div className={styles.nextFreeSlot}>
                <span className={styles.nextFreeLabel}>NEXT FREE</span>
                <span className={styles.nextFreeTime}>{NEXT_FREE_SLOT}</span>
              </div>

              {/* CTA Button */}
              <button type="button" className={styles.ctaButton} onClick={handleSeeSlots}>
                See available slots
              </button>
              <p className={styles.ctaHint}>Free · no card · reschedule any time</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});

ConsultationIntro.displayName = 'ConsultationIntro';
