// src/types/student.types.ts
export interface Student {
  _id?: string;
  libraryId: string;
  name: string;
  mobile: string;
  aadhar: string;
  rollNumber: string;
  shift: 'First' | 'Second' | 'Third' | 'Reserved';
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  fatherName: string;
  age: number;
  joiningDate: Date;
  nextDueDate: Date;
  lastPaidDate?: Date | null;
  createdAt?: Date;
}

export interface StudentFormData {
  name: string;
  mobile: string;
  aadhar: string;
  shift: string;
  gender: string;
  address: string;
  fatherName: string;
  age: string;
  joiningDate: Date;
  nextDueDate: Date;
}

export interface ValidationErrors {
  [key: string]: string;
}

export type RootStackParamList = {
  StudentPayment: { student: { name: string; _id: string } };
  // Add other screens here
};
