// src/redux/slices/libraryEnrollmentSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface password {
  isOpen: boolean;
}

const initialState: password = {
  isOpen: false,
};

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    setPasswordSheetOpen: state => {
      state.isOpen = true;
    },
    setPasswordSheetClose: state => {
      state.isOpen = false;
    },
  },
});

export const { setPasswordSheetClose, setPasswordSheetOpen } =
  passwordSlice.actions;
export default passwordSlice.reducer;
