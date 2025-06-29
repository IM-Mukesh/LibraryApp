// src/utils/validation.ts
import { StudentFormData, ValidationErrors } from '../types/student.types';

export const validateStudentForm = (
  data: StudentFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Mobile validation
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!data.mobile.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!mobileRegex.test(data.mobile.trim())) {
    errors.mobile = 'Enter a valid 10-digit mobile number';
  }

  // Aadhar validation
  const aadharRegex = /^\d{12}$/;
  if (!data.aadhar.trim()) {
    errors.aadhar = 'Aadhar number is required';
  } else if (!aadharRegex.test(data.aadhar.trim())) {
    errors.aadhar = 'Enter a valid 12-digit Aadhar number';
  }

  // Roll number validation
  //   if (!data.rollNumber.trim()) {
  //     errors.rollNumber = 'Roll number is required';
  //   }

  // Shift validation
  if (!data.shift) {
    errors.shift = 'Shift is required';
  }

  // Gender validation
  if (!data.gender) {
    errors.gender = 'Gender is required';
  }

  // Address validation
  if (!data.address.trim()) {
    errors.address = 'Address is required';
  }

  // Father's name validation
  if (!data.fatherName.trim()) {
    errors.fatherName = "Father's name is required";
  }

  // Age validation
  const age = parseInt(data.age);
  if (!data.age.trim()) {
    errors.age = 'Age is required';
  } else if (isNaN(age) || age < 10 || age > 60) {
    errors.age = 'Age must be between 10 and 60';
  }

  // Date validations
  if (!data.joiningDate) {
    errors.joiningDate = 'Joining date is required';
  }

  if (!data.nextDueDate) {
    errors.nextDueDate = 'Next due date is required';
  }

  if (
    data.joiningDate &&
    data.nextDueDate &&
    data.nextDueDate <= data.joiningDate
  ) {
    errors.nextDueDate = 'Next due date must be after joining date';
  }

  return errors;
};
