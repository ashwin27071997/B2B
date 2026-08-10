import { useState, useCallback, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useAuth } from '@/providers';
import { VALIDATION, VALIDATION_MESSAGES, AUTH_MESSAGES } from '@/constants';

export type AuthMode = 'signin' | 'signup';

export interface FormState {
  email: string;
  password: string;
  rememberMe: boolean;
  showPassword: boolean;
}

export interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export type SubmitStatus = 'idle' | 'submitting' | 'googleAuth' | 'success' | 'error';

export interface UseLoginFormReturn {
  mode: AuthMode;
  formState: FormState;
  errors: FormErrors;
  status: SubmitStatus;
  setMode: (mode: AuthMode) => void;
  toggleMode: () => void;
  handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleRememberMe: () => void;
  toggleShowPassword: () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleGoogleAuth: () => Promise<void>;
  resetForm: () => void;
  clearErrors: () => void;
}

const initialFormState: FormState = {
  email: '',
  password: '',
  rememberMe: true,
  showPassword: false,
};

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return VALIDATION_MESSAGES.EMAIL_REQUIRED;
  }
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return VALIDATION_MESSAGES.EMAIL_INVALID;
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
  }
  return undefined;
};

export const useLoginForm = (
  onSuccess?: (data: { email: string; mode: AuthMode }) => void
): UseLoginFormReturn => {
  const { signIn, signUp, signInWithGoogle, isLoaded } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');

  // Use refs for values needed in callbacks to avoid recreating callbacks
  const formStateRef = useRef(formState);
  formStateRef.current = formState;

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    clearErrors();
    setStatus('idle');
  }, [clearErrors]);

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, email: e.target.value }));
    setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
  }, []);

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, password: e.target.value }));
    setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
  }, []);

  const toggleRememberMe = useCallback(() => {
    setFormState((prev) => ({ ...prev, rememberMe: !prev.rememberMe }));
  }, []);

  const toggleShowPassword = useCallback(() => {
    setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const validate = useCallback((): boolean => {
    const { email, password } = formStateRef.current;
    const newErrors: FormErrors = {};

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSignIn = useCallback(async () => {
    if (!isLoaded) {
      setErrors({ general: AUTH_MESSAGES.NOT_INITIALIZED });
      return;
    }

    const { email, password } = formStateRef.current;

    const result = await signIn(email.trim(), password);

    if (result.success) {
      setStatus('success');
      onSuccessRef.current?.({ email: email.trim(), mode: 'signin' });
    } else {
      setStatus('error');
      setErrors({ general: result.error || AUTH_MESSAGES.SIGN_IN_FAILED });
    }
  }, [isLoaded, signIn]);

  const handleSignUp = useCallback(async () => {
    if (!isLoaded) {
      setErrors({ general: AUTH_MESSAGES.NOT_INITIALIZED });
      return;
    }

    const { email, password } = formStateRef.current;

    const result = await signUp(email.trim(), password);

    if (result.success) {
      setStatus('success');
      onSuccessRef.current?.({ email: email.trim(), mode: 'signup' });
    } else {
      setStatus('error');
      setErrors({ general: result.error || AUTH_MESSAGES.SIGN_UP_FAILED });
    }
  }, [isLoaded, signUp]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      setStatus('submitting');
      setErrors({});

      if (mode === 'signin') {
        await handleSignIn();
      } else {
        await handleSignUp();
      }
    },
    [validate, mode, handleSignIn, handleSignUp]
  );

  const handleGoogleAuth = useCallback(async () => {
    if (!isLoaded) {
      setErrors({ general: AUTH_MESSAGES.NOT_INITIALIZED });
      return;
    }

    setStatus('googleAuth');
    setErrors({});

    const result = await signInWithGoogle();

    if (!result.success) {
      setStatus('error');
      setErrors({ general: result.error || AUTH_MESSAGES.GOOGLE_FAILED });
    }
    // If success, the page will redirect to Google OAuth
  }, [isLoaded, signInWithGoogle]);

  const resetForm = useCallback(() => {
    setFormState(initialFormState);
    setErrors({});
    setStatus('idle');
  }, []);

  return {
    mode,
    formState,
    errors,
    status,
    setMode,
    toggleMode,
    handleEmailChange,
    handlePasswordChange,
    toggleRememberMe,
    toggleShowPassword,
    handleSubmit,
    handleGoogleAuth,
    resetForm,
    clearErrors,
  };
};
