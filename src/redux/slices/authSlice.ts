import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type structure for Library data
interface Library {
  _id: string;
  name: string;
  code: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  address: string;
  status: string;
  isPaymentRequired: boolean;
  billingAmount: number;
  lastPaidDate: string | null;
  nextDueDate: string;
  accessBlocked: boolean;
  paymentNotes: string;
  billingStartDate: string;
  createdAt: string;
  __v: number;
}

// Define the shape of the Auth state
interface AuthState {
  token: string | null;
  library: Library | null;
  isLoggedIn: boolean;
}

// Initial state
const initialState: AuthState = {
  token: null,
  library: null,
  isLoggedIn: false,
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    USER: (state, action: PayloadAction<Partial<AuthState>>) => {
      return { ...state, ...action.payload };
    },
    logout: state => {
      return { ...initialState }; // Reset to initial state
    },
  },
});

// Export
export const { USER, logout } = authSlice.actions;
export default authSlice.reducer;
