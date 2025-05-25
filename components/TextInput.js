import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.hasError ? '#dc3545' : '#e1e5e9'};
  border-radius: 0.5rem;
  font-size: 1rem;
  width: 100%;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#007bff'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 53, 69, 0.1)' : 'rgba(0, 123, 255, 0.1)'};
  }
  
  &::placeholder {
    color: #6c757d;
  }
  
  &:hover {
    border-color: ${props => props.hasError ? '#dc3545' : '#c6d0dd'};
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #dc3545;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.span`
  font-size: 0.75rem;
  color: #28a745;
  margin-top: 0.25rem;
`;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TextInput = ({ 
  label, 
  placeholder = "Enter text...", 
  type = "text", 
  value: controlledValue, 
  onChange: controlledOnChange, 
  error: externalError,
  required = false,
  validateEmail = false,
  showSuccess = false,
  ...props 
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [validationError, setValidationError] = useState('');
  const [touched, setTouched] = useState(false);
  
  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const isControlled = controlledValue !== undefined;
  
  // Validate email
  const validateEmailInput = (emailValue) => {
    if (!emailValue && required) {
      return 'Email is required';
    }
    if (emailValue && !EMAIL_REGEX.test(emailValue)) {
      return 'Please enter a valid email address';
    }
    return '';
  };
  
  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    // Validate email if needed
    if (validateEmail || type === 'email') {
      const emailError = validateEmailInput(newValue);
      setValidationError(emailError);
    }
    
    // Call external onChange if provided
    if (controlledOnChange) {
      controlledOnChange(e);
    }
  };
  
  // Handle blur for touched state
  const handleBlur = () => {
    setTouched(true);
  };
  
  // Determine which error to show
  const errorToShow = externalError || (touched && validationError);
  const hasError = Boolean(errorToShow);
  const isValid = (validateEmail || type === 'email') && value && !validationError && touched;
  
  return (
    <InputWrapper>
      {label && (
        <Label>
          {label}
          {required && <span style={{ color: '#dc3545' }}>*</span>}
        </Label>
      )}
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        hasError={hasError}
        {...props}
      />
      {errorToShow && <ErrorMessage>{errorToShow}</ErrorMessage>}
      {showSuccess && isValid && <SuccessMessage>✓ Valid email address</SuccessMessage>}
    </InputWrapper>
  );
};

export default TextInput;