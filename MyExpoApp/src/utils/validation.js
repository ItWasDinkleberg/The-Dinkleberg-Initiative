// Email validation utility
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation utility
export const validatePassword = (password) => {
  return password.length >= 8;
};

// Phone number validation utility
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Check if string is empty or only whitespace
export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};
