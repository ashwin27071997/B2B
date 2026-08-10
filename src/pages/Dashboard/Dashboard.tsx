import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers';
import { ROUTES } from '@/constants';
import styles from './Dashboard.module.css';

// Types
interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  date?: string;
}

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

// Mock data
const REGISTRATION_REF = 'LGL-2481';

const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    id: '1',
    title: 'Consultation booked',
    description: 'Mon 10 Aug 2026 · 11:30 AM IST',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Documents collected',
    description: 'PAN, Aadhaar, address proof, photos',
    status: 'in_progress',
  },
  {
    id: '3',
    title: 'Name approval (RUN)',
    description: 'MCA · typically 2 working days',
    status: 'pending',
  },
  {
    id: '4',
    title: 'Incorporation filed (SPICe+)',
    description: 'DIN, PAN, TAN issued together',
    status: 'pending',
  },
  {
    id: '5',
    title: 'GST & bank account',
    description: 'Current account opened with partner bank',
    status: 'pending',
  },
];

const DOCUMENTS_TO_UPLOAD: DocumentItem[] = [
  {
    id: '1',
    title: 'PAN & CIN matched',
    description: 'Verified against MCA',
    isCompleted: true,
  },
  {
    id: '2',
    title: 'File GSTR-3B for July',
    description: 'Due 20 Aug · ₹2,14,300',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Renew Udyam registration',
    description: 'Expires 04 Sep',
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Link current account',
    description: 'For EMD auto-debit',
    isCompleted: false,
  },
  {
    id: '5',
    title: 'Upload Class-3 DSC',
    description: 'Required for e-tender signing',
    isCompleted: false,
  },
];

// Memoized components
const BackgroundEffects = memo(() => (
  <div className={styles.backgroundEffects}>
    <div className={styles.glowIndigo} />
    <div className={styles.glowCyan} />
  </div>
));
BackgroundEffects.displayName = 'BackgroundEffects';

const CheckIcon = memo(() => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M3 7L6 10L11 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));
CheckIcon.displayName = 'CheckIcon';

const DotIcon = memo(() => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <circle cx="4" cy="4" r="3" fill="currentColor" />
  </svg>
));
DotIcon.displayName = 'DotIcon';

export const Dashboard = memo(() => {
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

  const userEmail = useMemo(() => {
    return user?.email || 'user@example.com';
  }, [user?.email]);

  // Calculate completed documents count
  const completedDocsCount = useMemo(() => {
    return DOCUMENTS_TO_UPLOAD.filter((doc) => doc.isCompleted).length;
  }, []);

  // Handlers
  const handleRestartDemo = useCallback(() => {
    navigate(ROUTES.BUSINESS_ONBOARDING);
  }, [navigate]);

  const handleGoToWorkspace = useCallback(() => {
    // Placeholder for workspace navigation
    console.log('Navigate to workspace');
  }, []);

  return (
    <div className={styles.container}>
      <BackgroundEffects />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className={styles.logoText}>Ledgerline</span>
        </div>
        <div className={styles.headerDivider} />
        <span className={styles.headerLabel}>BUSINESS ONBOARDING</span>
        <div className={styles.headerSpacer} />
        <button type="button" className={styles.restartButton} onClick={handleRestartDemo}>
          Restart demo
        </button>
        <div className={styles.userPill}>
          <div className={styles.userAvatar}>{userInitials}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName}</span>
            <span className={styles.userEmail}>{userEmail}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Layout Grid */}
          <div className={styles.layoutGrid}>
            {/* Left Column - Registration Steps */}
            <div className={styles.leftColumn}>
              {/* Status Badge */}
              <div className={styles.statusBadge}>
                <span className={styles.statusDot} />
                <span>Registration in progress · reference {REGISTRATION_REF}</span>
              </div>

              {/* Headlines */}
              <h1 className={styles.headline}>
                Your new registration, step by step.
              </h1>
              <p className={styles.subheadline}>
                Nothing is filed without your sign-off. You'll get a notification at every
                stage — and the entity appears on your ledger the moment the CIN is issued.
              </p>

              {/* Steps List */}
              <div className={styles.stepsList}>
                {REGISTRATION_STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`${styles.stepCard} ${styles[`stepCard_${step.status}`]}`}
                  >
                    <div
                      className={`${styles.stepIcon} ${styles[`stepIcon_${step.status}`]}`}
                    >
                      {step.status === 'completed' ? (
                        <CheckIcon />
                      ) : step.status === 'in_progress' ? (
                        <DotIcon />
                      ) : null}
                    </div>
                    <div className={styles.stepContent}>
                      <span className={styles.stepTitle}>{step.title}</span>
                      <span className={styles.stepDescription}>{step.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Documents to Upload */}
            <div className={styles.documentsCard}>
              <h2 className={styles.documentsTitle}>Documents to upload</h2>
              <p className={styles.documentsSubtitle}>
                Priya needs these before the call on Mon 10 Aug 2026 · 11:30 AM IST.
              </p>

              {/* Documents List */}
              <div className={styles.documentsList}>
                {DOCUMENTS_TO_UPLOAD.map((doc) => (
                  <div
                    key={doc.id}
                    className={`${styles.documentItem} ${doc.isCompleted ? styles.documentItem_completed : ''}`}
                  >
                    <div
                      className={`${styles.documentCheck} ${doc.isCompleted ? styles.documentCheck_completed : ''}`}
                    >
                      <CheckIcon />
                    </div>
                    <div className={styles.documentContent}>
                      <span className={styles.documentTitle}>{doc.title}</span>
                      <span className={styles.documentDescription}>{doc.description}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className={styles.documentsFooter}>
                <span className={styles.documentsProgress}>
                  {completedDocsCount} of {DOCUMENTS_TO_UPLOAD.length} done
                </span>
                <button
                  type="button"
                  className={styles.workspaceButton}
                  onClick={handleGoToWorkspace}
                >
                  Go to workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';
