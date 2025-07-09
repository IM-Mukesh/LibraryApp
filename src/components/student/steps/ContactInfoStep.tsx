import type React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FloatingLabelInput from '../EnhancedAnimatedInput';
import { Colors, Spacing, FontSizes } from '../../../theme/theme';
import type {
  StudentFormData,
  ValidationErrors,
} from '../../../types/student.types';

interface ContactInfoStepProps {
  formData: StudentFormData;
  errors: ValidationErrors;
  onInputChange: (field: keyof StudentFormData, value: any) => void;
}

export const ContactInfoStep: React.FC<ContactInfoStepProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Contact & Identity</Text>
        <Text style={styles.subtitle}>How can we reach you?</Text>
      </View>

      <View style={styles.form}>
        <FloatingLabelInput
          label="Mobile Number"
          value={formData.mobile}
          onChangeText={(value: any) => onInputChange('mobile', value)}
          error={errors.mobile}
          required
          keyboardType="phone-pad"
          maxLength={10}
          // icon="📱"
          // placeholder="Enter 10-digit mobile number"
        />

        <FloatingLabelInput
          label="Email Address"
          value={formData.email || ''}
          onChangeText={(value: any) => onInputChange('email', value)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          // icon="📧"
          // placeholder="Enter email address (optional)"
        />

        <FloatingLabelInput
          label="Aadhar Number"
          value={formData.aadhar}
          onChangeText={(value: any) => onInputChange('aadhar', value)}
          error={errors.aadhar}
          required
          keyboardType="numeric"
          maxLength={12}
          // icon="🆔"
          // placeholder="Enter 12-digit Aadhar number"
        />

        <FloatingLabelInput
          label="Address"
          value={formData.address}
          onChangeText={(value: any) => onInputChange('address', value)}
          error={errors.address}
          required
          multiline
          numberOfLines={4}
          autoCapitalize="sentences"
          // icon="🏠"
          // placeholder="Enter your complete address"
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
    paddingBottom: 120,
  },
});
