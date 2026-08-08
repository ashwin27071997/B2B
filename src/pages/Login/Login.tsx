import { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Checkbox,
  Divider,
  Cube3D,
  CheckIcon,
  GoogleIcon,
  ErrorMessage,
} from '@/components';
import { useLoginForm, useTiltEffect } from '@/hooks';
import { ROUTES } from '@/constants';
import styles from './Login.module.css';

// Memoized sub-components for performance
const BackgroundEffects = memo(() => (
  <div className={styles.backgroundEffects}>
    <div className={styles.glowIndigo} />
    <div className={styles.glowCyan} />
    <div className={styles.grid} />
  </div>
));
BackgroundEffects.displayName = 'BackgroundEffects';

const DecorativeCubes = memo(() => (
  <>
    <Cube3D size={132} variant="primary" className={styles.cubeTop} />
    <Cube3D size={92} variant="secondary" className={styles.cubeBottomLeft} />
    <Cube3D size={64} variant="primary" className={styles.cubeBottomRight} />
  </>
));
DecorativeCubes.displayName = 'DecorativeCubes';

const Logo = memo(() => (
  <div className={styles.logo}>
    <Cube3D size={34} variant="primary" />
    <span className={styles.logoText}>Ledgerline</span>
  </div>
));
Logo.displayName = 'Logo';

const GoogleIconWrapper = memo(() => (
  <span className={styles.googleIconWrapper}>
    <GoogleIcon size={18} />
  </span>
));
GoogleIconWrapper.displayName = 'GoogleIconWrapper';

export const Login = () => {
  const navigate = useNavigate();

  const {
    mode,
    formState,
    errors,
    status,
    toggleMode,
    handleEmailChange,
    handlePasswordChange,
    toggleRememberMe,
    handleSubmit,
    handleGoogleAuth,
    resetForm,
  } = useLoginForm();

  const tiltRef = useTiltEffect<HTMLDivElement>();

  const isSignUp = mode === 'signup';
  const isBusy = status === 'submitting' || status === 'googleAuth';
  const isSuccess = status === 'success';
  const hasError = status === 'error';

  // Redirect to dashboard after successful sign in
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const getHeading = () => (isSignUp ? 'Create account' : 'Sign in');
  const getSubheading = () =>
    isSignUp
      ? 'Two minutes and your money is modelled.'
      : 'Welcome back — pick up where you left off.';
  const getButtonText = () => {
    if (status === 'submitting') {
      return isSignUp ? 'Creating account' : 'Signing in';
    }
    return isSignUp ? 'Create account' : 'Sign in';
  };
  const getGoogleText = () => {
    if (status === 'googleAuth') return 'Connecting';
    return isSignUp ? 'Sign up with Google' : 'Continue with Google';
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <BackgroundEffects />
        <DecorativeCubes />

        <div className={styles.layout}>
          <div className={styles.heroSection}>
            <Logo />
          </div>

          <div className={styles.formSection} ref={tiltRef}>
            <div className={styles.card}>
              <div className={styles.successContent}>
                <span className={styles.successIcon}>
                  <CheckIcon size={26} />
                </span>
                <h2 className={styles.successTitle}>
                  {isSignUp ? "You're all set" : 'Signed in'}
                </h2>
                <p className={styles.successText}>
                  {isSignUp ? 'Confirmation sent to ' : 'Loading your workspace for '}
                  <span className={styles.successEmail}>
                    {formState.email.trim() || 'you'}
                  </span>
                </p>
                <Button variant="secondary" onClick={resetForm}>
                  Back to sign in
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <BackgroundEffects />
      <DecorativeCubes />

      <div className={styles.layout}>
        <div className={styles.heroSection}>
          <Logo />

          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>Bank-grade custody · SOC 2 Type II</span>
          </div>

          <h1 className={styles.headline}>
            Your whole money picture, in one place.
          </h1>
          <p className={styles.subheadline}>
            Accounts, goals and obligations modelled together — so every decision
            shows its consequence before you make it.
          </p>

          <div className={styles.features}>
            <div className={styles.featureCard}>
              <span className={styles.featureIconPrimary} />
              <span>Live balances across 12,000 institutions</span>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIconSecondary} />
              <span>Scenario modelling, not static dashboards</span>
            </div>
          </div>
        </div>

        <div className={styles.formSection} ref={tiltRef}>
          <div className={styles.card}>
            <div className={styles.formContent}>
              <h2 className={styles.formTitle}>{getHeading()}</h2>
              <p className={styles.formSubtitle}>{getSubheading()}</p>

              <Button
                variant="secondary"
                fullWidth
                onClick={handleGoogleAuth}
                disabled={isBusy}
                loading={status === 'googleAuth'}
                icon={<GoogleIconWrapper />}
                className={styles.googleButton}
              >
                {getGoogleText()}
              </Button>

              <Divider />

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formFields}>
                  <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={formState.email}
                    onChange={handleEmailChange}
                    error={errors.email}
                    disabled={isBusy}
                  />
                  <Input
                    label="Password"
                    type="password"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    placeholder="••••••••"
                    value={formState.password}
                    onChange={handlePasswordChange}
                    showPasswordToggle
                    error={errors.password}
                    disabled={isBusy}
                  />
                </div>

                {hasError && errors.general && (
                  <div className={styles.generalError}>
                    <ErrorMessage message={errors.general} />
                  </div>
                )}

                <div className={styles.formActions}>
                  <Checkbox
                    label="Keep me signed in"
                    checked={formState.rememberMe}
                    onChange={toggleRememberMe}
                  />
                  <a href="#" className={styles.forgotLink}>
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  fullWidth
                  loading={status === 'submitting'}
                  disabled={isBusy}
                >
                  {getButtonText()}
                </Button>
              </form>

              <div className={styles.switchMode}>
                <span className={styles.switchModeText}>
                  {isSignUp ? 'Already have an account?' : 'New to Ledgerline?'}
                </span>
                <Button variant="ghost" onClick={toggleMode}>
                  {isSignUp ? 'Sign in' : 'Create one'}
                </Button>
              </div>

              <p className={styles.legal}>
                By continuing you agree to our{' '}
                <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
