// // src/components/student/StudentEnrollmentForm.tsx
// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Animated,
//   Alert,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import { AnimatedInput } from '../ui/AnimatedInput';
// import { AnimatedPicker } from '../ui/AnimatedPicker';
// import { DatePicker } from '../ui/DatePicker';
// import { AnimatedButton } from '../ui/AnimatedButton';
// import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
// import { StudentFormData, ValidationErrors } from '../../types/student.types';
// import { validateStudentForm } from '../../utils/validation';
// import { createStudent, setAuthToken } from '../../apis/api';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';
// import { useHideTabBarOnKeyboard } from '../../hooks/useHideTabBarOnKeyboard';
// import BackButton from '../BackButton';
// const { width: screenWidth } = Dimensions.get('window');

// interface StudentEnrollmentFormProps {}

// export const StudentEnrollmentForm: React.FC<StudentEnrollmentFormProps> = ({
//   navigation,
// }: any) => {
//   useHideTabBarOnKeyboard(navigation);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(50)).current;
//   const progressAnim = useRef(new Animated.Value(0)).current;
//   const libraryId = useSelector(
//     (state: RootState) => state?.auth?.library?._id,
//   );
//   const [formData, setFormData] = useState<StudentFormData>({
//     name: '',
//     mobile: '',
//     aadhar: '',
//     shift: '',
//     gender: '',
//     address: '',
//     fatherName: '',
//     age: '',
//     joiningDate: new Date(),
//     nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
//   });
//   const { token } = useSelector((state: RootState) => state.auth);
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [loading, setLoading] = useState<boolean>(false);

//   React.useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   // Update progress animation based on form completion
//   React.useEffect(() => {
//     const filledFields = Object.values(formData).filter(value => {
//       if (value instanceof Date) return true;
//       return value !== '';
//     }).length;
//     const totalFields = Object.keys(formData).length;
//     const progress = filledFields / totalFields;

//     Animated.timing(progressAnim, {
//       toValue: progress,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   }, [formData]);

//   const resetFormData = (): StudentFormData => ({
//     name: '',
//     mobile: '',
//     aadhar: '',
//     shift: '',
//     gender: '',
//     address: '',
//     fatherName: '',
//     age: '',
//     joiningDate: new Date(),
//     nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//   });

//   const shiftOptions = [
//     { label: 'First Shift', value: 'First' },
//     { label: 'Second Shift', value: 'Second' },
//     { label: 'Third Shift', value: 'Third' },
//     { label: 'Reserved', value: 'Reserved' },
//   ];

//   const genderOptions = [
//     { label: 'Male', value: 'Male' },
//     { label: 'Female', value: 'Female' },
//     { label: 'Other', value: 'Other' },
//   ];

//   const handleInputChange = (field: keyof StudentFormData, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const handleSubmit = async () => {
//     const validationErrors = validateStudentForm(formData);
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length > 0) {
//       Alert.alert(
//         'Validation Error',
//         'Please fix the errors before submitting',
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       setAuthToken(token);
//       const fixedData = {
//         ...formData,
//         age: parseInt(formData.age),
//         joiningDate: formData.joiningDate.toISOString(),
//         nextDueDate: formData.nextDueDate.toISOString(),
//         libraryId: libraryId!,
//       };

//       // ✅ DIRECTLY call createStudent from api.ts
//       const createdStudent = await createStudent(fixedData);
//       if (createdStudent) {
//       }
//       Alert.alert('Success', `Student enrolled: ${createdStudent.name}`, [
//         {
//           text: 'OK',
//           onPress: () => {
//             setFormData(resetFormData());
//             setErrors({});
//             Animated.timing(progressAnim, {
//               toValue: 0,
//               duration: 300,
//               useNativeDriver: false,
//             }).start();
//             if (navigation) {
//               navigation.goBack();
//             }
//           },
//         },
//       ]);
//     } catch (error: any) {
//       console.error('Submission error:', error);
//       Alert.alert('Error', error.message || 'Failed to create student');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     Alert.alert('Reset Form', 'Are you sure you want to reset all fields?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Reset',
//         style: 'destructive',
//         onPress: () => {
//           setFormData(resetFormData());
//           setErrors({});

//           // Reset progress animation
//           Animated.timing(progressAnim, {
//             toValue: 0,
//             duration: 300,
//             useNativeDriver: false,
//           }).start();
//         },
//       },
//     ]);
//   };

//   const renderProgressBar = () => (
//     <View style={styles.progressContainer}>
//       <View style={styles.progressBar}>
//         <Animated.View
//           style={[
//             styles.progressFill,
//             {
//               width: progressAnim.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: ['0%', '100%'],
//               }),
//             },
//           ]}
//         />
//       </View>
//       {/* <Text style={styles.progressText}>Form Progress</Text> */}
//     </View>
//   );

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
//     >
//       <BackButton />
//       <Animated.View
//         style={[
//           styles.formContainer,
//           {
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }],
//           },
//         ]}
//       >
//         {/* <View style={styles.header}>
//           <Text style={styles.title}>Student Enrollment</Text>
//           <Text style={styles.subtitle}>
//             Fill details to enroll a new student
//           </Text>
//           {renderProgressBar()}
//         </View> */}

//         <ScrollView
//           style={styles.scrollView}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//           contentContainerStyle={styles.scrollContent}
//         >
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Personal Information</Text>

//             <AnimatedInput
//               label="Full Name"
//               value={formData.name}
//               onChangeText={value => handleInputChange('name', value)}
//               error={errors.name}
//               required
//               autoCapitalize="words"
//               autoCorrect={false}
//               icon={<Text style={styles.inputIcon}>👤</Text>}
//             />

//             <AnimatedInput
//               label="Mobile Number"
//               value={formData.mobile}
//               onChangeText={value => handleInputChange('mobile', value)}
//               error={errors.mobile}
//               required
//               keyboardType="phone-pad"
//               maxLength={10}
//               icon={<Text style={styles.inputIcon}>📱</Text>}
//             />

//             <AnimatedInput
//               label="Aadhar Number"
//               value={formData.aadhar}
//               onChangeText={value => handleInputChange('aadhar', value)}
//               error={errors.aadhar}
//               required
//               keyboardType="numeric"
//               maxLength={12}
//               icon={<Text style={styles.inputIcon}>🆔</Text>}
//             />

//             <AnimatedInput
//               label="Father's Name"
//               value={formData.fatherName}
//               onChangeText={value => handleInputChange('fatherName', value)}
//               error={errors.fatherName}
//               required
//               autoCapitalize="words"
//               autoCorrect={false}
//               icon={<Text style={styles.inputIcon}>👨‍👦</Text>}
//             />

//             <AnimatedInput
//               label="Age"
//               value={formData.age}
//               onChangeText={value => handleInputChange('age', value)}
//               error={errors.age}
//               required
//               keyboardType="numeric"
//               maxLength={2}
//               containerStyle={styles.halfWidth}
//               icon={<Text style={styles.inputIcon}>🎂</Text>}
//             />

//             <AnimatedPicker
//               label="Gender"
//               value={formData.gender}
//               options={genderOptions}
//               onSelect={value => handleInputChange('gender', value)}
//               error={errors.gender}
//               required
//               containerStyle={styles.halfWidth}
//               icon={<Text style={styles.inputIcon}>⚧</Text>}
//             />

//             <AnimatedInput
//               label="Address"
//               value={formData.address}
//               onChangeText={value => handleInputChange('address', value)}
//               error={errors.address}
//               required
//               multiline
//               numberOfLines={3}
//               autoCapitalize="sentences"
//               icon={<Text style={styles.inputIcon}>🏠</Text>}
//             />
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Academic Information</Text>

//             <AnimatedPicker
//               label="Shift"
//               value={formData.shift}
//               options={shiftOptions}
//               onSelect={value => handleInputChange('shift', value)}
//               error={errors.shift}
//               required
//               icon={<Text style={styles.inputIcon}>⏰</Text>}
//             />
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Date Information</Text>

//             <DatePicker
//               label="Joining Date"
//               value={formData.joiningDate}
//               onChange={date => handleInputChange('joiningDate', date)}
//               error={errors.joiningDate}
//               required
//               maximumDate={new Date()}
//               icon={<Text style={styles.inputIcon}>📅</Text>}
//             />

//             <DatePicker
//               label="Next Due Date"
//               value={formData.nextDueDate}
//               onChange={date => handleInputChange('nextDueDate', date)}
//               error={errors.nextDueDate}
//               required
//               minimumDate={new Date()}
//               icon={<Text style={styles.inputIcon}>💰</Text>}
//             />
//           </View>

//           <View style={styles.buttonSection}>
//             <AnimatedButton
//               title="Enroll Student"
//               onPress={handleSubmit}
//               loading={loading}
//               size="medium"
//               icon={<Text style={styles.buttonIcon}>✅</Text>}
//               style={styles.fullWidthButton}
//               disabled={loading}
//             />

//             <TouchableOpacity
//               style={[styles.resetButton, { marginTop: Spacing.md }]}
//               onPress={resetForm}
//               disabled={loading}
//             >
//               <Text style={styles.resetButtonText}>Reset Form</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </Animated.View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   buttonSection: {
//     // paddingHorizontal: Spacing.xs, // 16px padding on both sides
//     // marginTop: Spacing.lg,
//   },

//   fullWidthButton: {
//     width: '100%',
//     // paddingVertical: Spacing.md,
//     backgroundColor: Colors.primary,
//     borderRadius: Radius.lg,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   buttonIcon: {
//     fontSize: FontSizes.large,
//     marginRight: Spacing.sm,
//     color: Colors.white,
//   },

//   resetButton: {
//     width: '100%',
//     padding: Spacing.md,
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: Colors.primary,
//     borderRadius: Radius.lg,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   resetButtonText: {
//     color: Colors.primary,
//     fontSize: FontSizes.medium,
//     fontWeight: 'bold',
//   },

//   formContainer: {
//     flex: 1,
//     margin: Spacing.md,
//   },
//   button: {
//     padding: Spacing.sm,
//     marginBottom: Spacing.sm,
//     width: 50,
//     // marginLeft: Spacing.md,
//   },
//   header: {
//     backgroundColor: Colors.white,
//     // padding: Spacing.xs,
//     borderRadius: Radius.lg,
//     marginBottom: Spacing.md,
//     elevation: 3,
//     shadowColor: Colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 3.84,
//   },
//   title: {
//     fontSize: FontSizes.xlarge,
//     fontWeight: 'bold',
//     color: Colors.primary,
//     textAlign: 'center',
//     marginBottom: Spacing.xs,
//   },
//   subtitle: {
//     fontSize: FontSizes.medium,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     marginBottom: Spacing.md,
//   },
//   progressContainer: {
//     // marginTop: Spacing.sm,
//   },
//   progressBar: {
//     height: 4,
//     backgroundColor: Colors.border,
//     borderRadius: 2,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: Colors.primary,
//     borderRadius: 2,
//   },
//   progressText: {
//     fontSize: FontSizes.small,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     marginTop: Spacing.xs,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: Spacing.xl,
//   },
//   section: {
//     backgroundColor: Colors.white,
//     padding: Spacing.lg,
//     borderRadius: Radius.lg,
//     marginBottom: Spacing.md,
//     elevation: 2,
//     shadowColor: Colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//   },
//   sectionTitle: {
//     fontSize: FontSizes.large,
//     fontWeight: 'bold',
//     color: Colors.primary,
//     marginBottom: Spacing.md,
//     borderBottomWidth: 2,
//     borderBottomColor: Colors.primary + '20',
//     paddingBottom: Spacing.sm,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   halfWidth: {
//     width: screenWidth < 400 ? '100%' : '48%',
//     marginBottom: screenWidth < 400 ? Spacing.md : 0,
//   },
//   inputIcon: {
//     fontSize: 20,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   resetIcon: {
//     fontSize: 16,
//     color: Colors.primary,
//   },
// });

// 'use client';

// import type React from 'react';
// import { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   Dimensions,
//   StatusBar,
//   Platform,
//   Vibration,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withTiming,
// } from 'react-native-reanimated';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import { StepIndicator } from './StepIndicator';
// import { FormPager } from './FormPager';
// import { StepNavigation } from './StepNavigation';
// import { PersonalInfoStep } from './steps/PersonalInfoStep';
// import { ContactInfoStep } from './steps/ContactInfoStep';
// import { AcademicInfoStep } from './steps/AcademicInfoStep';
// import { ReviewStep } from './steps/ReviewStep';
// import { Colors, Spacing } from '../../theme/theme';
// import type {
//   StudentFormData,
//   ValidationErrors,
// } from '../../types/student.types';
// import { validateStep } from '../../utils/stepValidation';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
// const STORAGE_KEY = 'student_enrollment_draft';

// interface StudentEnrollmentFormProps {
//   navigation?: any;
// }

// export const StudentEnrollmentForm: React.FC<StudentEnrollmentFormProps> = ({
//   navigation,
// }) => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState<StudentFormData>({
//     name: '',
//     dateOfBirth: new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), // Default to 18 years ago
//     gender: '',
//     fatherName: '',
//     mobile: '',
//     email: '',
//     aadhar: '',
//     address: '',
//     shift: '',
//     joiningDate: new Date(),
//     nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//   });
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [loading, setLoading] = useState(false);

//   // Animations
//   const backgroundOpacity = useSharedValue(0);
//   const containerScale = useSharedValue(0.95);

//   useEffect(() => {
//     // Initial animations
//     backgroundOpacity.value = withTiming(1, { duration: 800 });
//     containerScale.value = withSpring(1, { damping: 15, stiffness: 150 });

//     // Load saved data
//     loadSavedData();
//   }, []);

//   // Auto-save functionality
//   useEffect(() => {
//     const saveData = async () => {
//       try {
//         await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
//       } catch (error) {
//         console.error('Failed to save form data:', error);
//       }
//     };

//     const timeoutId = setTimeout(saveData, 1000); // Debounce saves
//     return () => clearTimeout(timeoutId);
//   }, [formData]);

//   const loadSavedData = async () => {
//     try {
//       const savedData = await AsyncStorage.getItem(STORAGE_KEY);
//       if (savedData) {
//         const parsedData = JSON.parse(savedData);
//         // Convert date strings back to Date objects
//         parsedData.dateOfBirth = new Date(parsedData.dateOfBirth);
//         parsedData.joiningDate = new Date(parsedData.joiningDate);
//         parsedData.nextDueDate = new Date(parsedData.nextDueDate);
//         setFormData(parsedData);
//       }
//     } catch (error) {
//       console.error('Failed to load saved data:', error);
//     }
//   };

//   const handleInputChange = (field: keyof StudentFormData, value: any) => {
//     setFormData(prev => {
//       const newData = { ...prev, [field]: value };

//       // Smart date logic
//       if (field === 'joiningDate' && value instanceof Date) {
//         // Auto-update next due date when joining date changes
//         const nextDue = new Date(value.getTime() + 30 * 24 * 60 * 60 * 1000);
//         newData.nextDueDate = nextDue;
//       }

//       return newData;
//     });

//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const validateCurrentStep = () => {
//     const stepErrors = validateStep(currentStep, formData);
//     setErrors(stepErrors);
//     return Object.keys(stepErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateCurrentStep()) {
//       if (currentStep < 3) {
//         setCurrentStep(prev => prev + 1);
//         // Haptic feedback
//         if (Platform.OS === 'ios') {
//           Vibration.vibrate(10);
//         }
//       }
//     } else {
//       // Error haptic feedback
//       if (Platform.OS === 'ios') {
//         Vibration.vibrate([0, 100, 50, 100]);
//       }
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setCurrentStep(prev => prev - 1);
//       if (Platform.OS === 'ios') {
//         Vibration.vibrate(10);
//       }
//     }
//   };

//   const handleStepChange = (step: number) => {
//     // Validate all previous steps before allowing navigation
//     let canNavigate = true;
//     for (let i = 0; i < step; i++) {
//       const stepErrors = validateStep(i, formData);
//       if (Object.keys(stepErrors).length > 0) {
//         canNavigate = false;
//         break;
//       }
//     }

//     if (canNavigate) {
//       setCurrentStep(step);
//     } else {
//       Alert.alert(
//         'Incomplete Information',
//         'Please complete all previous steps before proceeding.',
//       );
//     }
//   };

//   const handleSubmit = async () => {
//     // Validate all steps
//     let allErrors: ValidationErrors = {};
//     for (let i = 0; i < 4; i++) {
//       const stepErrors = validateStep(i, formData);
//       allErrors = { ...allErrors, ...stepErrors };
//     }

//     if (Object.keys(allErrors).length > 0) {
//       setErrors(allErrors);
//       Alert.alert(
//         'Validation Error',
//         'Please fix all errors before submitting.',
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       // Clear saved data on successful submission
//       await AsyncStorage.removeItem(STORAGE_KEY);

//       Alert.alert('Success!', 'Student enrolled successfully!', [
//         {
//           text: 'OK',
//           onPress: () => {
//             if (navigation) {
//               navigation.goBack();
//             }
//           },
//         },
//       ]);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to enroll student. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const backgroundStyle = useAnimatedStyle(() => ({
//     opacity: backgroundOpacity.value,
//   }));

//   const containerStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: containerScale.value }],
//   }));

//   const steps = [
//     <PersonalInfoStep
//       key="personal"
//       formData={formData}
//       errors={errors}
//       onInputChange={handleInputChange}
//     />,
//     <ContactInfoStep
//       key="contact"
//       formData={formData}
//       errors={errors}
//       onInputChange={handleInputChange}
//     />,
//     <AcademicInfoStep
//       key="academic"
//       formData={formData}
//       errors={errors}
//       onInputChange={handleInputChange}
//     />,
//     <ReviewStep
//       key="review"
//       formData={formData}
//       onEdit={handleStepChange}
//       onSubmit={handleSubmit}
//       loading={loading}
//     />,
//   ];

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
//       <SafeAreaView style={styles.safeArea}>
//         <Animated.View style={[styles.background, backgroundStyle]} />

//         <Animated.View style={[styles.formContainer, containerStyle]}>
//           <StepIndicator
//             currentStep={currentStep}
//             totalSteps={4}
//             onStepPress={handleStepChange}
//           />

//           <FormPager
//             steps={steps}
//             currentStep={currentStep}
//             onStepChange={setCurrentStep}
//           />

//           <StepNavigation
//             currentStep={currentStep}
//             totalSteps={4}
//             onNext={handleNext}
//             onPrevious={handlePrevious}
//             canProceed={validateCurrentStep()}
//             loading={loading}
//           />
//         </Animated.View>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.primary,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   background: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: `linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.secondary} 100%)`,
//   },
//   formContainer: {
//     flex: 1,
//     margin: Spacing.md,
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     borderRadius: 24,
//     overflow: 'hidden',
//     shadowColor: Colors.black,
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.3,
//     shadowRadius: 20,
//     elevation: 15,
//   },
// });

'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Vibration,
  Alert,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {
  createStudent,
  setAuthToken,
  CreateStudentInput,
} from '../../apis/api';
import { StepIndicator } from './StepIndicator';
import { FormPager } from './FormPager';
import { StepNavigation } from './StepNavigation';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ContactInfoStep } from './steps/ContactInfoStep';
import { AcademicInfoStep } from './steps/AcademicInfoStep';
import { ReviewStep } from './steps/ReviewStep';
import { Colors, Spacing } from '../../theme/theme';
import type {
  StudentFormData,
  ValidationErrors,
} from '../../types/student.types';
import { validateStep } from '../../utils/stepValidation';
import { useHideTabBarOnKeyboard } from '../../hooks/useHideTabBarOnKeyboard';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const STORAGE_KEY = 'student_enrollment_draft';

interface StudentEnrollmentFormProps {
  navigation?: any;
}

export const StudentEnrollmentForm: React.FC<StudentEnrollmentFormProps> = ({
  navigation,
}) => {
  useHideTabBarOnKeyboard(navigation);
  const [currentStep, setCurrentStep] = useState(0);
  const initialDate = new Date();
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    dateOfBirth: new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), // Default to 18 years ago
    gender: '',
    fatherName: '',
    mobile: '',
    email: '',
    aadhar: '',
    address: '',
    shift: '',
    joiningDate: initialDate,
    nextDueDate: new Date(initialDate.getTime()), // Same as joining date
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);
  const [modalType, setModalType] = useState<'success' | 'error' | null>(null);

  // Animations
  const backgroundOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.95);

  useEffect(() => {
    // Initial animations
    backgroundOpacity.value = withTiming(1, { duration: 800 });
    containerScale.value = withSpring(1, { damping: 15, stiffness: 150 });

    // Load saved data
    loadSavedData();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error('Failed to save form data:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 1000); // Debounce saves
    return () => clearTimeout(timeoutId);
  }, [formData]);

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Convert date strings back to Date objects
        parsedData.dateOfBirth = new Date(parsedData.dateOfBirth);
        parsedData.joiningDate = new Date(parsedData.joiningDate);
        parsedData.nextDueDate = new Date(parsedData.nextDueDate);
        setFormData(parsedData);
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
  };

  const handleInputChange = useCallback(
    (field: keyof StudentFormData, value: any) => {
      setFormData(prev => {
        const newData = { ...prev, [field]: value };

        // Smart date logic - set due date same as joining date
        if (field === 'joiningDate' && value instanceof Date) {
          // Set next due date to be the same as joining date
          newData.nextDueDate = new Date(value.getTime());
        }

        return newData;
      });

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [errors],
  );

  // Memoize validation to prevent re-renders
  const currentStepIsValid = useMemo(() => {
    const stepErrors = validateStep(currentStep, formData);
    console.log('step errors', stepErrors);

    return Object.keys(stepErrors).length === 0;
  }, [currentStep, formData]);

  const validateCurrentStep = useCallback(() => {
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [currentStep, formData]);

  // Transform formData to match API expectations
  const transformFormDataForAPI = (
    data: StudentFormData,
  ): CreateStudentInput => {
    return {
      name: data.name,
      dateOfBirth: data.dateOfBirth.toISOString().split('T')[0],
      gender: data.gender,
      fatherName: data.fatherName,
      mobile: data.mobile,
      email: data.email,
      aadhar: data.aadhar,
      address: data.address,
      shift: data.shift,
      joiningDate: data.joiningDate.toISOString().split('T')[0],
      nextDueDate: data.nextDueDate.toISOString().split('T')[0],
    };
  };
  const handleNext = useCallback(async () => {
    if (validateCurrentStep()) {
      console.log('pressed...');

      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
        // Haptic feedback
        if (Platform.OS === 'ios') {
          Vibration.vibrate(10);
        }
      } else {
        // Final step - create student
        console.log('pressed final...');
        setLoading(true);

        try {
          // Set auth token if available
          if (token) {
            setAuthToken(token);
          }

          // Transform form data to match API expectations
          const studentData = transformFormDataForAPI(formData);
          console.log('st data is', studentData);
          // return;

          // Make API call
          const createdStudent = await createStudent(studentData);

          console.log('Student created successfully:', createdStudent);

          // Clear saved data on successful submission
          await AsyncStorage.removeItem(STORAGE_KEY);

          // Show success modal/alert
          setModalType('success');
          setShowModal(true);

          // Success haptic feedback
          if (Platform.OS === 'ios') {
            Vibration.vibrate([0, 50, 100, 50]);
          }

          // Navigate back or to success screen after a delay
          setTimeout(() => {
            setShowModal(false);
            if (navigation) {
              // navigation.goBack();
              navigation.navigate('StudentList', { studentCreated: true });
            }
          }, 4000);
        } catch (error: any) {
          console.error('Failed to create student:', error);

          // Show error modal/alert
          setModalType('error');
          setShowModal(true);

          // Error haptic feedback
          if (Platform.OS === 'ios') {
            Vibration.vibrate([0, 100, 50, 100]);
          }

          Alert.alert(
            'Error',
            error.message || 'Failed to enroll student. Please try again.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setShowModal(false);
                  setModalType(null);
                },
              },
            ],
          );
        } finally {
          setLoading(false);
        }
      }
    } else {
      // Error haptic feedback
      if (Platform.OS === 'ios') {
        Vibration.vibrate([0, 100, 50, 100]);
      }
    }
  }, [currentStep, validateCurrentStep, formData, token, navigation]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      if (Platform.OS === 'ios') {
        Vibration.vibrate(10);
      }
    }
  }, [currentStep]);

  const handleStepChange = useCallback(
    (step: number) => {
      // Validate all previous steps before allowing navigation
      let canNavigate = true;
      for (let i = 0; i < step; i++) {
        const stepErrors = validateStep(i, formData);
        if (Object.keys(stepErrors).length > 0) {
          canNavigate = false;
          break;
        }
      }

      if (canNavigate) {
        setCurrentStep(step);
      } else {
        Alert.alert(
          'Incomplete Information',
          'Please complete all previous steps before proceeding.',
        );
      }
    },
    [formData],
  );

  const handleSubmit = useCallback(async () => {
    // Validate all steps
    let allErrors: ValidationErrors = {};
    for (let i = 0; i < 4; i++) {
      const stepErrors = validateStep(i, formData);
      allErrors = { ...allErrors, ...stepErrors };
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      Alert.alert(
        'Validation Error',
        'Please fix all errors before submitting.',
      );
      return;
    }

    // This will be handled by handleNext when on final step
    await handleNext();
  }, [formData, handleNext]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setModalType(null);
  }, []);

  // Memoize steps to prevent re-creation on every render
  const steps = useMemo(
    () => [
      <PersonalInfoStep
        key="personal"
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
      />,
      <ContactInfoStep
        key="contact"
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
      />,
      <AcademicInfoStep
        key="academic"
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
      />,
      <ReviewStep
        key="review"
        formData={formData}
        onEdit={handleStepChange}
        onSubmit={handleSubmit}
        loading={loading}
        showModal={showModal}
        modalType={modalType}
        onModalClose={handleModalClose}
      />,
    ],
    [
      formData,
      errors,
      handleInputChange,
      handleStepChange,
      handleSubmit,
      loading,
      showModal,
      modalType,
      handleModalClose,
    ],
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.background, backgroundStyle]}>
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        <Animated.View style={[styles.formContainer, containerStyle]}>
          <StepIndicator
            currentStep={currentStep}
            totalSteps={4}
            onStepPress={handleStepChange}
          />

          <FormPager
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />

          <StepNavigation
            currentStep={currentStep}
            totalSteps={4}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canProceed={currentStepIsValid}
            loading={loading}
          />
        </Animated.View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'green',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 16,
    backgroundColor: Colors.card,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    margin: Spacing.md,
  },
});
