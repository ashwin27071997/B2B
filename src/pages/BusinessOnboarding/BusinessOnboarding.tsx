import { memo } from 'react';
import { useBusinessOnboarding } from './BusinessOnboarding.hooks';
import type { BusinessStatus } from './BusinessOnboarding.types';
import styles from './BusinessOnboarding.module.css';

// Status display configuration
const STATUS_LABELS: Record<BusinessStatus, string> = {
  verified: 'Verified',
  draft: 'Draft 2/5',
  action: 'Action needed',
};

const STATUS_STYLES: Record<BusinessStatus, string> = {
  verified: styles.tagVerified,
  draft: styles.tagDraft,
  action: styles.tagAction,
};

// Memoized icon components
const PlusIcon = memo(function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path
        d="M10 3.5v13M3.5 10h13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
});

const CheckIcon = memo(function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path
        d="M3.5 10.5l4.2 4.2L16.5 5.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

// Memoized background component
const BackgroundEffects = memo(function BackgroundEffects() {
  return (
    <div className={styles.backgroundEffects}>
      <div className={styles.glowIndigo} />
      <div className={styles.glowCyan} />
    </div>
  );
});

export const BusinessOnboarding = memo(function BusinessOnboarding() {
  const {
    userInitials,
    userName,
    handleBookConsultation,
    handleEnterBusiness,
    handleNoGst,
    handleSelectBusiness,
    businesses,
  } = useBusinessOnboarding();

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
          {/* Status Badge */}
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} />
            <span>Signed in · no business linked to this account yet</span>
          </div>

          {/* Headlines */}
          <h1 className={styles.headline}>Let's get a business on your ledger.</h1>
          <p className={styles.subheadline}>
            Start a fresh registration with one of our advisors, or connect a company you have
            already registered and we'll pull its filings in.
          </p>

          {/* Cards Grid */}
          <div className={styles.cardsGrid}>
            {/* Create New Business Card */}
            <div className={`${styles.optionCard} ${styles.optionCardPrimary}`}>
              <div className={`${styles.cardIcon} ${styles.cardIconPrimary}`}>
                <PlusIcon />
              </div>
              <h2 className={styles.cardTitle}>Create a new business registration</h2>
              <p className={styles.cardDescription}>
                You don't have a company yet. Book a 30-minute call — an advisor works out the right
                structure, the licences you'll need and what it costs, then files it for you.
              </p>
              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <span className={styles.featureDot} />
                  <span>Pvt Ltd, LLP, OPC or proprietorship — advised, not guessed</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureDot} />
                  <span>GST, MSME & trade licence mapped to your state</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureDot} />
                  <span>Document checklist sent before the call</span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleBookConsultation}
                >
                  Book a consultation slot
                </button>
                <p className={styles.cardHint}>
                  Free · no card · slots open for the next 10 working days
                </p>
              </div>
            </div>

            {/* Continue with Existing Registration Card */}
            <div className={`${styles.optionCard} ${styles.optionCardSecondary}`}>
              <div className={`${styles.cardIcon} ${styles.cardIconSecondary}`}>
                <CheckIcon />
              </div>
              <h2 className={styles.cardTitle}>Continue with an existing registration</h2>
              <p className={styles.cardDescription}>
                Already incorporated? Give us the GSTIN and what you trade in — we'll match filings,
                invoices and bids to it.
              </p>

              <div className={styles.businessList}>
                <div className={styles.businessListHeader}>FOUND ON YOUR PAN & MOBILE</div>
                {businesses.map((business) => (
                  <button
                    key={business.id}
                    type="button"
                    className={styles.businessItem}
                    onClick={() => handleSelectBusiness(business.id)}
                  >
                    <div className={styles.businessInitials}>{business.initials}</div>
                    <div className={styles.businessInfo}>
                      <span className={styles.businessName}>{business.name}</span>
                      <span className={styles.businessMeta}>{business.meta}</span>
                    </div>
                    <span className={`${styles.businessTag} ${STATUS_STYLES[business.status]}`}>
                      {STATUS_LABELS[business.status]}
                    </span>
                  </button>
                ))}
              </div>

              <div className={styles.cardFooter}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleEnterBusiness}
                >
                  Enter a different business
                </button>
                <p className={styles.cardHint}>Takes about 3 minutes · GSTIN verified instantly</p>
                <button type="button" className={styles.linkButton} onClick={handleNoGst}>
                  No GST number? That's fine — start here
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});
