// src/redux/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import sheetReducer from './slices/bottomSheetSlice';
// import libraryEnrollmentReducer from './slices/libraryEnrollmentSlice';
// 👉 import future slices here (e.g., studentReducer, settingsReducer, etc.)
import paymentReducer from './slices/paymentSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  // libraryEnroll: libraryEnrollmentReducer,
  password: sheetReducer,
  payment: paymentReducer,
  // student: studentReducer,
  // settings: settingsReducer,
});

export default rootReducer;
