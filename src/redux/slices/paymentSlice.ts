import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// This matches the student object you're dispatching
export interface StudentData {
  _id: string;
  name: string;
  rollNumber?: string;
  mobile?: string;
  aadhar?: string;
  address?: string;
  fatherName?: string;
  age?: number;
  gender?: string;
  shift?: string;
  joiningDate?: string;
  lastPaidDate?: string | null;
  nextDueDate?: string;
  libraryId?: string;
  createdAt?: string;
  __v?: number;
}

interface PaymentState {
  student: StudentData | null;
}

const initialState: PaymentState = {
  student: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setStudentPayment: (state, action: PayloadAction<StudentData>) => {
      state.student = action.payload;
    },
    clearStudentPayment: state => {
      state.student = null;
    },
  },
});

export const { setStudentPayment, clearStudentPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
