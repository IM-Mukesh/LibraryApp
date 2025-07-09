import type React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SummaryCard } from '../SummaryCard';
import { StatusModal } from '../../StatusModal';
import { Colors, Spacing, FontSizes, Radius } from '../../../theme/theme';
import type { StudentFormData } from '../../../types/student.types';

interface ReviewStepProps {
  formData: StudentFormData;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  loading: boolean;
  showModal: boolean;
  modalType: 'success' | 'error' | null;
  onModalClose: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onEdit,
  onSubmit,
  loading,
  showModal,
  modalType,
  onModalClose,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

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

  const getShiftLabel = (shift: string) => {
    const shiftMap: { [key: string]: string } = {
      First: 'First Shift (6:00 AM - 12:00 PM)',
      Second: 'Second Shift (12:00 PM - 6:00 PM)',
      Third: 'Third Shift (6:00 PM - 12:00 AM)',
      Reserved: 'Reserved Slot',
    };
    return shiftMap[shift] || shift;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Review & Submit</Text>
        <Text style={styles.subtitle}>
          Please review your information before submitting
        </Text>
      </View>

      <View style={styles.content}>
        <SummaryCard
          title="Personal Information"
          icon="👤"
          onEdit={() => onEdit(0)}
          data={[
            { label: 'Full Name', value: formData.name },
            {
              label: 'Date of Birth',
              value: `${formatDate(formData.dateOfBirth)} (${calculateAge(
                formData.dateOfBirth,
              )} years)`,
            },
            { label: 'Gender', value: formData.gender },
            { label: "Father's Name", value: formData.fatherName },
          ]}
        />

        <SummaryCard
          title="Contact & Identity"
          icon="📱"
          onEdit={() => onEdit(1)}
          data={[
            { label: 'Mobile Number', value: formData.mobile },
            { label: 'Email', value: formData.email || 'Not provided' },
            { label: 'Aadhar Number', value: formData.aadhar },
            { label: 'Address', value: formData.address },
          ]}
        />

        <SummaryCard
          title="Academic Information"
          icon="📚"
          onEdit={() => onEdit(2)}
          data={[
            { label: 'Study Shift', value: getShiftLabel(formData.shift) },
            { label: 'Joining Date', value: formatDate(formData.joiningDate) },
            { label: 'Next Due Date', value: formatDate(formData.nextDueDate) },
          ]}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={onSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Enrolling Student...' : 'Enroll Student'}
          </Text>
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            By submitting this form, you confirm that all information provided
            is accurate and complete.
          </Text>
        </View>
      </View>

      <StatusModal
        visible={showModal}
        type={modalType}
        onClose={onModalClose}
        successTitle="Student Enrolled Successfully!"
        successMessage="The student has been successfully enrolled in the system."
        errorTitle="Enrollment Failed"
        errorMessage="There was an error enrolling the student. Please try again."
      />
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
  content: {
    padding: Spacing.sm,
    paddingBottom: 120,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.xl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: FontSizes.large,
    fontWeight: 'bold',
  },
  disclaimer: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
  },
  disclaimerText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
