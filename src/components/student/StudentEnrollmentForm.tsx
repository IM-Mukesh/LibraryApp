// src/components/student/StudentEnrollmentForm.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { AnimatedInput } from '../ui/AnimatedInput';
import { AnimatedPicker } from '../ui/AnimatedPicker';
import { DatePicker } from '../ui/DatePicker';
import { AnimatedButton } from '../ui/AnimatedButton';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
import { StudentFormData, ValidationErrors } from '../../types/student.types';
import { validateStudentForm } from '../../utils/validation';
import { createStudent, setAuthToken } from '../../apis/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useHideTabBarOnKeyboard } from '../../hooks/useHideTabBarOnKeyboard';
import BackButton from '../BackButton';
const { width: screenWidth } = Dimensions.get('window');

interface StudentEnrollmentFormProps {}

export const StudentEnrollmentForm: React.FC<StudentEnrollmentFormProps> = ({
  navigation,
}: any) => {
  useHideTabBarOnKeyboard(navigation);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const libraryId = useSelector(
    (state: RootState) => state?.auth?.library?._id,
  );
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    mobile: '',
    aadhar: '',
    shift: '',
    gender: '',
    address: '',
    fatherName: '',
    age: '',
    joiningDate: new Date(),
    nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  });
  const { token } = useSelector((state: RootState) => state.auth);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Update progress animation based on form completion
  React.useEffect(() => {
    const filledFields = Object.values(formData).filter(value => {
      if (value instanceof Date) return true;
      return value !== '';
    }).length;
    const totalFields = Object.keys(formData).length;
    const progress = filledFields / totalFields;

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [formData]);

  const resetFormData = (): StudentFormData => ({
    name: '',
    mobile: '',
    aadhar: '',
    shift: '',
    gender: '',
    address: '',
    fatherName: '',
    age: '',
    joiningDate: new Date(),
    nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const shiftOptions = [
    { label: 'First Shift', value: 'First' },
    { label: 'Second Shift', value: 'Second' },
    { label: 'Third Shift', value: 'Third' },
    { label: 'Reserved', value: 'Reserved' },
  ];

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const handleInputChange = (field: keyof StudentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateStudentForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Alert.alert(
        'Validation Error',
        'Please fix the errors before submitting',
      );
      return;
    }

    setLoading(true);

    try {
      setAuthToken(token);
      const fixedData = {
        ...formData,
        age: parseInt(formData.age),
        joiningDate: formData.joiningDate.toISOString(),
        nextDueDate: formData.nextDueDate.toISOString(),
        libraryId: libraryId!,
      };

      // ✅ DIRECTLY call createStudent from api.ts
      const createdStudent = await createStudent(fixedData);

      Alert.alert('Success', `Student enrolled: ${createdStudent.name}`, [
        {
          text: 'OK',
          onPress: () => {
            setFormData(resetFormData());
            setErrors({});
            Animated.timing(progressAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start();
            if (navigation) {
              navigation.goBack();
            }
          },
        },
      ]);
    } catch (error: any) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    Alert.alert('Reset Form', 'Are you sure you want to reset all fields?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          setFormData(resetFormData());
          setErrors({});

          // Reset progress animation
          Animated.timing(progressAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        },
      },
    ]);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      {/* <Text style={styles.progressText}>Form Progress</Text> */}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <BackButton />
      <Animated.View
        style={[
          styles.formContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Student Enrollment</Text>
          <Text style={styles.subtitle}>
            Fill details to enroll a new student
          </Text>
          {renderProgressBar()}
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <AnimatedInput
              label="Full Name"
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
              error={errors.name}
              required
              autoCapitalize="words"
              autoCorrect={false}
              icon={<Text style={styles.inputIcon}>👤</Text>}
            />

            <AnimatedInput
              label="Mobile Number"
              value={formData.mobile}
              onChangeText={value => handleInputChange('mobile', value)}
              error={errors.mobile}
              required
              keyboardType="phone-pad"
              maxLength={10}
              icon={<Text style={styles.inputIcon}>📱</Text>}
            />

            <AnimatedInput
              label="Aadhar Number"
              value={formData.aadhar}
              onChangeText={value => handleInputChange('aadhar', value)}
              error={errors.aadhar}
              required
              keyboardType="numeric"
              maxLength={12}
              icon={<Text style={styles.inputIcon}>🆔</Text>}
            />

            <AnimatedInput
              label="Father's Name"
              value={formData.fatherName}
              onChangeText={value => handleInputChange('fatherName', value)}
              error={errors.fatherName}
              required
              autoCapitalize="words"
              autoCorrect={false}
              icon={<Text style={styles.inputIcon}>👨‍👦</Text>}
            />

            <AnimatedInput
              label="Age"
              value={formData.age}
              onChangeText={value => handleInputChange('age', value)}
              error={errors.age}
              required
              keyboardType="numeric"
              maxLength={2}
              containerStyle={styles.halfWidth}
              icon={<Text style={styles.inputIcon}>🎂</Text>}
            />

            <AnimatedPicker
              label="Gender"
              value={formData.gender}
              options={genderOptions}
              onSelect={value => handleInputChange('gender', value)}
              error={errors.gender}
              required
              containerStyle={styles.halfWidth}
              icon={<Text style={styles.inputIcon}>⚧</Text>}
            />

            <AnimatedInput
              label="Address"
              value={formData.address}
              onChangeText={value => handleInputChange('address', value)}
              error={errors.address}
              required
              multiline
              numberOfLines={3}
              autoCapitalize="sentences"
              icon={<Text style={styles.inputIcon}>🏠</Text>}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Academic Information</Text>

            <AnimatedPicker
              label="Shift"
              value={formData.shift}
              options={shiftOptions}
              onSelect={value => handleInputChange('shift', value)}
              error={errors.shift}
              required
              icon={<Text style={styles.inputIcon}>⏰</Text>}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date Information</Text>

            <DatePicker
              label="Joining Date"
              value={formData.joiningDate}
              onChange={date => handleInputChange('joiningDate', date)}
              error={errors.joiningDate}
              required
              maximumDate={new Date()}
              icon={<Text style={styles.inputIcon}>📅</Text>}
            />

            <DatePicker
              label="Next Due Date"
              value={formData.nextDueDate}
              onChange={date => handleInputChange('nextDueDate', date)}
              error={errors.nextDueDate}
              required
              minimumDate={new Date()}
              icon={<Text style={styles.inputIcon}>💰</Text>}
            />
          </View>

          <View style={styles.buttonSection}>
            <AnimatedButton
              title="Enroll Student"
              onPress={handleSubmit}
              loading={loading}
              size="medium"
              icon={<Text style={styles.buttonIcon}>✅</Text>}
              style={styles.fullWidthButton}
              disabled={loading}
            />

            <TouchableOpacity
              style={[styles.resetButton, { marginTop: Spacing.md }]}
              onPress={resetForm}
              disabled={loading}
            >
              <Text style={styles.resetButtonText}>Reset Form</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  buttonSection: {
    // paddingHorizontal: Spacing.xs, // 16px padding on both sides
    // marginTop: Spacing.lg,
  },

  fullWidthButton: {
    width: '100%',
    // paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonIcon: {
    fontSize: FontSizes.large,
    marginRight: Spacing.sm,
    color: Colors.white,
  },

  resetButton: {
    width: '100%',
    padding: Spacing.md,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  resetButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },

  formContainer: {
    flex: 1,
    margin: Spacing.md,
  },
  button: {
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    width: 50,
    // marginLeft: Spacing.md,
  },
  header: {
    backgroundColor: Colors.white,
    // padding: Spacing.xs,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  progressContainer: {
    // marginTop: Spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  section: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary + '20',
    paddingBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  halfWidth: {
    width: screenWidth < 400 ? '100%' : '48%',
    marginBottom: screenWidth < 400 ? Spacing.md : 0,
  },
  inputIcon: {
    fontSize: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetIcon: {
    fontSize: 16,
    color: Colors.primary,
  },
});
