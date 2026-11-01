// Email validation regex conforming to standard email format
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const validateName = (name) => {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return 'Recipient name is required.';
  }
  if (trimmed.length < 2) {
    return 'Recipient name must contain at least 2 characters.';
  }
  if (trimmed.length > 100) {
    return 'Recipient name must not exceed 100 characters.';
  }
  return null;
};

export const validateEmail = (email) => {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return 'Email address is required.';
  }
  if (trimmed.length > 254) {
    return 'Email address must not exceed 254 characters.';
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Invalid email address.';
  }
  return null;
};

export const validateEventName = (eventName) => {
  const trimmed = (eventName || '').trim();
  if (!trimmed) {
    return 'Event name is required.';
  }
  if (trimmed.length < 3) {
    return 'Event name must be at least 3 characters.';
  }
  if (trimmed.length > 150) {
    return 'Event name must not exceed 150 characters.';
  }
  return null;
};

export const validateCompletionDate = (dateStr) => {
  if (!dateStr) {
    return 'Completion date is required.';
  }
  const dateObj = new Date(dateStr);
  if (Number.isNaN(dateObj.getTime())) {
    return 'Invalid date format.';
  }
  return null;
};

export const validateRecipient = (recipient) => {
  const nameError = validateName(recipient.name);
  const emailError = validateEmail(recipient.email);

  return {
    isValid: !nameError && !emailError,
    nameError,
    emailError,
  };
};

export const validateRecipientsList = (recipients) => {
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return {
      isValid: false,
      error: 'At least one recipient is required.',
      validCount: 0,
      invalidCount: 0,
      items: [],
    };
  }

  if (recipients.length > 1000) {
    return {
      isValid: false,
      error: 'A maximum of 1,000 recipients can be submitted in one batch.',
      validCount: 0,
      invalidCount: 0,
      items: [],
    };
  }

  let validCount = 0;
  let invalidCount = 0;

  const evaluatedItems = recipients.map((r, index) => {
    const val = validateRecipient(r);
    if (val.isValid) {
      validCount += 1;
    } else {
      invalidCount += 1;
    }
    return {
      ...r,
      index,
      name: (r.name || '').trim(),
      email: (r.email || '').trim(),
      isValid: val.isValid,
      nameError: val.nameError,
      emailError: val.emailError,
    };
  });

  return {
    isValid: invalidCount === 0 && validCount > 0,
    error: invalidCount > 0 ? `${invalidCount} recipient(s) contain validation errors.` : null,
    validCount,
    invalidCount,
    items: evaluatedItems,
  };
};
