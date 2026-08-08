import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react';

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
    return 'Enter your email address.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return 'That email address does not look right.';
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (password.length < 8) {
    return 'Use at least 8 characters.';
  }
  return undefined;
};

export const useLoginForm = (
  onSuccess?: (data: { email: string; mode: AuthMode }) => void,
  authDelay: number = 1100
): UseLoginFormReturn => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');

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
    const newErrors: FormErrors = {};

    const emailError = validateEmail(formState.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(formState.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState.email, formState.password]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      setStatus('submitting');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, authDelay));

      setStatus('success');
      onSuccess?.({ email: formState.email.trim(), mode });
    },
    [validate, formState.email, mode, onSuccess, authDelay]
  );

  const handleGoogleAuth = useCallback(async () => {
    setStatus('googleAuth');

    // Simulate Google auth
    await new Promise((resolve) => setTimeout(resolve, authDelay));

    setStatus('success');
    onSuccess?.({ email: 'user@google.com', mode });
  }, [mode, onSuccess, authDelay]);

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
