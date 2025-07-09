'use client';

import type React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FloatingLabelInput from '../EnhancedAnimatedInput';
import { EnhancedAnimatedPicker } from '../EnhancedAnimatedPicker';
import { EnhancedDatePicker } from '../EnhancedDatePicker';
import { Colors, Spacing, FontSizes } from '../../../theme/theme';
import type {
  StudentFormData,
  ValidationErrors,
} from '../../../types/student.types';

interface PersonalInfoStepProps {
  formData: StudentFormData;
  errors: ValidationErrors;
  onInputChange: (field: keyof StudentFormData, value: any) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Personal Information</Text>
        <Text style={styles.subtitle}>Let's start with your basic details</Text>
      </View>

      <View style={styles.form}>
        <FloatingLabelInput
          label="Full Name"
          value={formData.name}
          onChangeText={(value: any) => onInputChange('name', value)}
          error={errors.name}
          required
          autoCapitalize="words"
          autoCorrect={false}
          // icon="👤"
          // placeholder="Enter your full name"
        />

        <EnhancedDatePicker
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={date => onInputChange('dateOfBirth', date)}
          error={errors.dateOfBirth}
          required
          maximumDate={new Date()}
          // icon="🎂"
          // showAge
          age={calculateAge(formData.dateOfBirth)}
        />

        <EnhancedAnimatedPicker
          label="Gender"
          value={formData.gender}
          options={genderOptions}
          onSelect={value => onInputChange('gender', value)}
          error={errors.gender}
          required
          // icon="⚧"
          // placeholder="Select your gender"
        />

        <FloatingLabelInput
          label="Father's Name"
          value={formData.fatherName}
          onChangeText={(value: any) => onInputChange('fatherName', value)}
          error={errors.fatherName}
          required
          autoCapitalize="words"
          autoCorrect={false}
          // icon="👨‍👦"
          // placeholder="Enter father's name"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: Spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    padding: Spacing.lg,
    paddingBottom: 120, // Space for navigation buttons
  },
});
