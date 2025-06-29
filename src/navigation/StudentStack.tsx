// src/navigation/StudentStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentPage from '../screens/StudentPage';
import { StudentEnrollmentForm } from '../components/student/StudentEnrollmentForm';
import { StudentPaymentScreen } from '../components/student/StudentPaymentScreen';
const Stack = createNativeStackNavigator();

const StudentStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentList" component={StudentPage} />
      <Stack.Screen
        name="StudentEnroll"
        component={StudentEnrollmentForm}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="StudentPayment"
        component={StudentPaymentScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

export default StudentStack;
