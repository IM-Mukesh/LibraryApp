export interface Student {
  _id?: string;
  libraryId: string;
  name: string;
  mobile: string;
  email?: string;
  aadhar: string;
  rollNumber: string;
  shift: 'First' | 'Second' | 'Third' | 'Reserved';
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  fatherName: string;
  dateOfBirth: Date;
  joiningDate: Date;
  nextDueDate: Date;
  lastPaidDate?: Date | null;
  createdAt?: Date;
}

export interface StudentFormData {
  name: string;
  dateOfBirth: Date;
  gender: string;
  fatherName: string;
  mobile: string;
  email?: string;
  aadhar: string;
  address: string;
  shift: string;
  joiningDate: Date;
  nextDueDate: Date;
}

export interface ValidationErrors {
  [key: string]: string;
}

export type RootStackParamList = {
  StudentPayment: { student: { name: string; _id: string } };
};
