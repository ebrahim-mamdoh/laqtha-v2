'use client';

import React, { createContext, useContext, useCallback, useReducer, useMemo, useEffect } from 'react';
import type { FormState, FormActions, FieldConfig } from './types';

/* ============================================================================
   Initial State
   ============================================================================ */

const initialFormState: FormState = {
  values: {},
  errors: {},
  touched: {},
  isSubmitting: false,
  isValidating: false,
  isDirty: false,
  isValid: true,
};

/* ============================================================================
   Actions
   ============================================================================ */

type FormAction =
  | { type: 'SET_VALUE'; name: string; value: unknown }
  | { type: 'SET_VALUES'; values: Record<string, unknown> }
  | { type: 'SET_ERROR'; name: string; error: string }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'SET_TOUCHED'; name: string; touched: boolean }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_VALIDATING'; isValidating: boolean }
  | { type: 'RESET'; initialValues: Record<string, unknown> };

/* ============================================================================
   Reducer
   ============================================================================ */

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        values: { ...state.values, [action.name]: action.value },
        isDirty: true,
      };
    case 'SET_VALUES':
      return {
        ...state,
        values: { ...state.values, ...action.values },
        isDirty: true,
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.name]: action.error },
        isValid: Object.values({ ...state.errors, [action.name]: action.error }).every(e => !e),
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
        isValid: Object.values(action.errors).every(e => !e),
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.name]: action.touched },
      };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };
    case 'SET_VALIDATING':
      return { ...state, isValidating: action.isValidating };
    case 'RESET':
      return {
        ...initialFormState,
        values: action.initialValues,
      };
    default:
      return state;
  }
}

/* ============================================================================
   Validation Utils
   ============================================================================ */

function validateField(
  value: unknown,
  field: FieldConfig,
  allValues: Record<string, unknown>
): string | undefined {
  // Required validation
  if (field.required) {
    if (value === undefined || value === null || value === '') {
      return `${field.label} مطلوب`;
    }
    if (Array.isArray(value) && value.length === 0) {
      return `${field.label} مطلوب`;
    }
  }

  // Skip further validation if empty and not required
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const validation = field.validation;
  if (!validation) return undefined;

  // String validations
  if (typeof value === 'string') {
    if (validation.minLength && value.length < validation.minLength) {
      return `${field.label} يجب أن يكون على الأقل ${validation.minLength} حرف`;
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      return `${field.label} يجب ألا يتجاوز ${validation.maxLength} حرف`;
    }
    if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
      return validation.patternMessage || `${field.label} غير صالح`;
    }
  }

  // Number validations
  if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
    const numValue = Number(value);
    if (validation.min !== undefined && numValue < validation.min) {
      return `${field.label} يجب أن يكون على الأقل ${validation.min}`;
    }
    if (validation.max !== undefined && numValue > validation.max) {
      return `${field.label} يجب ألا يتجاوز ${validation.max}`;
    }
  }

  // Custom validation
  if (validation.custom) {
    return validation.custom(value, allValues);
  }

  return undefined;
}

export function validateForm(
  values: Record<string, unknown>,
  fields: FieldConfig[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const error = validateField(values[field.name], field, values);
    if (error) {
      errors[field.name] = error;
    }
  }

  return errors;
}

/* ============================================================================
   Context
   ============================================================================ */

interface FormContextValue {
  state: FormState;
  actions: FormActions;
  fields: FieldConfig[];
  registerField: (name: string) => void;
  unregisterField: (name: string) => void;
}

const FormContext = createContext<FormContextValue | undefined>(undefined);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

/* ============================================================================
   Form Provider
   ============================================================================ */

interface FormProviderProps {
  children: React.ReactNode;
  fields: FieldConfig[];
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  onChange?: (values: Record<string, unknown>) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function FormProvider({
  children,
  fields,
  initialValues = {},
  onSubmit,
  onChange,
  validateOnChange = true,
  validateOnBlur = true,
}: FormProviderProps) {
  // Build initial values from fields and provided initialValues
  const defaultValues = useMemo(() => {
    const defaults: Record<string, unknown> = {};
    for (const field of fields) {
      defaults[field.name] = initialValues[field.name] ?? field.defaultValue ?? '';
    }
    return defaults;
  }, [fields, initialValues]);

  const [state, dispatch] = useReducer(formReducer, {
    ...initialFormState,
    values: defaultValues,
  });

  // Notify parent of changes
  useEffect(() => {
    if (onChange && state.isDirty) {
      onChange(state.values);
    }
  }, [state.values, state.isDirty, onChange]);

  // Actions
  const setValue = useCallback((name: string, value: unknown) => {
    dispatch({ type: 'SET_VALUE', name, value });
    
    if (validateOnChange) {
      const field = fields.find(f => f.name === name);
      if (field) {
        const error = validateField(value, field, state.values);
        dispatch({ type: 'SET_ERROR', name, error: error || '' });
      }
    }
  }, [fields, validateOnChange, state.values]);

  const setValues = useCallback((values: Record<string, unknown>) => {
    dispatch({ type: 'SET_VALUES', values });
  }, []);

  const setError = useCallback((name: string, error: string) => {
    dispatch({ type: 'SET_ERROR', name, error });
  }, []);

  const setTouched = useCallback((name: string, touched = true) => {
    dispatch({ type: 'SET_TOUCHED', name, touched });
    
    if (validateOnBlur && touched) {
      const field = fields.find(f => f.name === name);
      if (field) {
        const error = validateField(state.values[name], field, state.values);
        dispatch({ type: 'SET_ERROR', name, error: error || '' });
      }
    }
  }, [fields, validateOnBlur, state.values]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET', initialValues: defaultValues });
  }, [defaultValues]);

  const validate = useCallback(async () => {
    dispatch({ type: 'SET_VALIDATING', isValidating: true });
    const errors = validateForm(state.values, fields);
    dispatch({ type: 'SET_ERRORS', errors });
    dispatch({ type: 'SET_VALIDATING', isValidating: false });
    return Object.keys(errors).length === 0;
  }, [state.values, fields]);

  const submit = useCallback(async () => {
    // Mark all fields as touched
    for (const field of fields) {
      dispatch({ type: 'SET_TOUCHED', name: field.name, touched: true });
    }

    const isValid = await validate();
    if (!isValid) return;

    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
    try {
      await onSubmit(state.values);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  }, [validate, onSubmit, state.values, fields]);

  const registerField = useCallback((name: string) => {
    // Field registration logic if needed
  }, []);

  const unregisterField = useCallback((name: string) => {
    // Field unregistration logic if needed
  }, []);

  const actions: FormActions = useMemo(() => ({
    setValue,
    setValues,
    setError,
    setTouched,
    reset,
    validate,
    submit,
  }), [setValue, setValues, setError, setTouched, reset, validate, submit]);

  const value: FormContextValue = {
    state,
    actions,
    fields,
    registerField,
    unregisterField,
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
}

/* ============================================================================
   Field Hook
   ============================================================================ */

export function useField(name: string) {
  const { state, actions, fields } = useFormContext();
  
  const field = useMemo(() => fields.find(f => f.name === name), [fields, name]);
  
  return {
    field,
    value: state.values[name],
    error: state.errors[name],
    touched: state.touched[name],
    setValue: (value: unknown) => actions.setValue(name, value),
    setTouched: () => actions.setTouched(name, true),
    setError: (error: string) => actions.setError(name, error),
  };
}

/* ============================================================================
   Default Export
   ============================================================================ */

export default FormProvider;
