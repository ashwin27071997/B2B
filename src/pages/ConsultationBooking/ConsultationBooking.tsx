import { memo } from 'react';
import { useConsultationBooking } from './ConsultationBooking.hooks';
import styles from './ConsultationBooking.module.css';

// Memoized components
const BackgroundEffects = memo(function BackgroundEffects() {
  return (
    <div className={styles.backgroundEffects}>
      <div className={styles.glowIndigo} />
      <div className={styles.glowCyan} />
    </div>
  );
});

const BackArrowIcon = memo(function BackArrowIcon() {
  return (
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
  );
});

const ChevronLeftIcon = memo(function ChevronLeftIcon() {
  return (
    <svg width="8" height="13" viewBox="0 0 9 15">
      <path d="M7.5 1.5l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
});

const ChevronRightIcon = memo(function ChevronRightIcon() {
  return (
    <svg width="8" height="13" viewBox="0 0 9 15">
      <path d="M1.5 1.5l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
});

export const ConsultationBooking = memo(function ConsultationBooking() {
  const {
    userInitials,
    userName,
    selectedDate,
    selectedSlot,
    selectedTopics,
    phone,
    language,
    isSubmitting,
    error,
    calendarWeeks,
    selectedTimeLabel,
    availableSlotsCount,
    handleBack,
    handleDateSelect,
    handleSlotSelect,
    handleTopicToggle,
    handlePhoneChange,
    handleLanguageChange,
    handleSubmit,
    morningSlots,
    afternoonSlots,
    topics,
    languages,
    daysOfWeek,
  } = useConsultationBooking();

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
                  {daysOfWeek.map((day, i) => (
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
                  {morningSlots.map((slot) => (
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
                  {afternoonSlots.map((slot) => (
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
                  {topics.map((topic) => (
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
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    {languages.map((lang) => (
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
