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
  profileImage: string;
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
  isUploadingImage: boolean;
  uploadProgress: number;
}

// Initial state
const initialState: AuthState = {
  token: null,
  library: null,
  isLoggedIn: false,
  isUploadingImage: false,
  uploadProgress: 0,
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
    // Profile image related actions
    updateProfileImage: (state, action: PayloadAction<string>) => {
      if (state.library) {
        state.library.profileImage = action.payload;
      }
    },
    setImageUploadStart: state => {
      state.isUploadingImage = true;
      state.uploadProgress = 0;
    },
    setImageUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setImageUploadComplete: (state, action: PayloadAction<string>) => {
      state.isUploadingImage = false;
      state.uploadProgress = 100;
      if (state.library) {
        state.library.profileImage = action.payload;
      }
    },
    setImageUploadError: state => {
      state.isUploadingImage = false;
      state.uploadProgress = 0;
    },
    // Update entire library data
    updateLibrary: (state, action: PayloadAction<Partial<Library>>) => {
      if (state.library) {
        state.library = { ...state.library, ...action.payload };
      }
    },
  },
});

// Export actions
export const {
  USER,
  logout,
  updateProfileImage,
  setImageUploadStart,
  setImageUploadProgress,
  setImageUploadComplete,
  setImageUploadError,
  updateLibrary,
} = authSlice.actions;

export default authSlice.reducer;

// Export types for use in components
export type { Library, AuthState };
