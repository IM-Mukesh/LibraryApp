'use client';

import type React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { EnhancedAnimatedPicker } from '../EnhancedAnimatedPicker';
import { EnhancedDatePicker } from '../EnhancedDatePicker';
import { Colors, Spacing, FontSizes } from '../../../theme/theme';
import type {
  StudentFormData,
  ValidationErrors,
} from '../../../types/student.types';

interface AcademicInfoStepProps {
  formData: StudentFormData;
  errors: ValidationErrors;
  onInputChange: (field: keyof StudentFormData, value: any) => void;
}

export const AcademicInfoStep: React.FC<AcademicInfoStepProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  const shiftOptions = [
    { label: 'Morning', value: 'First' },
    { label: 'Afternoon', value: 'Second' },
    { label: 'Evening', value: 'Third' },
    { label: 'Reserved Slot', value: 'Reserved' },
  ];

  const getMinimumDueDate = () => {
    const joiningDate = new Date(formData.joiningDate);
    return new Date(joiningDate.getTime() + 24 * 60 * 60 * 1000); // Next day
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Academic Information</Text>
        <Text style={styles.subtitle}>Choose your study preferences</Text>
      </View>

      <View style={styles.form}>
        <EnhancedAnimatedPicker
          label="Study Shift"
          value={formData.shift}
          options={shiftOptions}
          onSelect={value => onInputChange('shift', value)}
          error={errors.shift}
          required
          // icon="⏰"
          placeholder="Select your preferred shift"
        />

        <EnhancedDatePicker
          label="Joining Date"
          value={formData.joiningDate}
          onChange={date => onInputChange('joiningDate', date)}
          error={errors.joiningDate}
          required
          maximumDate={new Date()}
          // icon="📅"
        />

        {/* <EnhancedDatePicker
          label="Next Due Date"
          value={formData.nextDueDate}
          onChange={date => onInputChange('nextDueDate', date)}
          error={errors.nextDueDate}
          required
          minimumDate={getMinimumDueDate()}
          // icon="💰"
          disabled={true}
          helperText="Automatically set to 30 days from joining date you can change while making payment"
        /> */}

        {/* <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📚 Study Schedule</Text>
          <Text style={styles.infoText}>
            Your selected shift will determine your daily study hours and
            library access times.
          </Text>
        </View> */}
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
    paddingVertical: Spacing.lg,
    // backgroundColor: 'red',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  infoCard: {
    backgroundColor: Colors.primary + '10',
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoTitle: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
