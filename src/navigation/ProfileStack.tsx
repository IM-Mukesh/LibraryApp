// src/navigation/ProfileStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import ChangePasswordScreen from '../components/Profile/ChangePasswordScreen';
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileDetails" component={ProfileScreen} />
      <Stack.Screen name="changepassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
