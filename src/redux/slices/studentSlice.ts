// src/redux/slices/studentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Student } from '../../apis/api';

interface StudentState {
  students: Student[];
}

const initialState: StudentState = {
  students: [],
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.unshift(action.payload);
    },
    clearStudents: state => {
      state.students = [];
    },
  },
});

export const { setStudents, addStudent, clearStudents } = studentSlice.actions;

export default studentSlice.reducer;
