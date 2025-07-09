import type { StudentFormData, ValidationErrors } from '../types/student.types';

export const validateStep = (
  step: number,
  formData: StudentFormData,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  switch (step) {
    case 0: // Personal Information
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }

      if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required';
      } else {
        const age =
          new Date().getFullYear() - formData.dateOfBirth.getFullYear();
        if (age < 10 || age > 60) {
          errors.dateOfBirth = 'Age must be between 10 and 60 years';
        }
      }

      if (!formData.gender) {
        errors.gender = 'Gender is required';
      }

      if (!formData.fatherName.trim()) {
        errors.fatherName = "Father's name is required";
      }
      break;

    case 1: // Contact & Identity
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!formData.mobile.trim()) {
        errors.mobile = 'Mobile number is required';
      } else if (!mobileRegex.test(formData.mobile.trim())) {
        errors.mobile = 'Enter a valid 10-digit mobile number';
      }

      if (formData.email && formData.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
          errors.email = 'Enter a valid email address';
        }
      }

      const aadharRegex = /^\d{12}$/;
      if (!formData.aadhar.trim()) {
        errors.aadhar = 'Aadhar number is required';
      } else if (!aadharRegex.test(formData.aadhar.trim())) {
        errors.aadhar = 'Enter a valid 12-digit Aadhar number';
      }

      if (!formData.address.trim()) {
        errors.address = 'Address is required';
      }
      break;

    case 2: // Academic Information
      if (!formData.shift) {
        errors.shift = 'Shift is required';
      }

      if (!formData.joiningDate) {
        errors.joiningDate = 'Joining date is required';
      } else if (formData.joiningDate > new Date()) {
        errors.joiningDate = 'Joining date cannot be in the future';
      }

      if (!formData.nextDueDate) {
        errors.nextDueDate = 'Next due date is required';
      }
      // else if (
      //   formData.joiningDate &&
      //   formData.nextDueDate <= formData.joiningDate
      // ) {
      //   errors.nextDueDate = 'Next due date must be after joining date';
      // }
      break;

    case 3: // Review (validate all)
      return {
        ...validateStep(0, formData),
        ...validateStep(1, formData),
        ...validateStep(2, formData),
      };
  }

  return errors;
};
