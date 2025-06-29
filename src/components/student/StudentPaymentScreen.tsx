// Main StudentPaymentScreen.tsx (Updated with Date Range)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { DatePicker } from '../ui/DatePicker';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
import { PaymentModeSelector } from './PaymentModeSelector';
import Icon from 'react-native-vector-icons/Ionicons';

import { DiscountSection } from './DiscountSection';
import { PaymentSummary } from './PaymentSummary';
import {
  CreatePaymentPayload,
  createPayment,
  setAuthToken,
} from '../../apis/api';
import { useHideTabBarOnKeyboard } from '../../hooks/useHideTabBarOnKeyboard';
import NotesInput from './PaymentNotes';
const { width } = Dimensions.get('window');

interface StudentData {
  _id: string;
  aadhar: string;
  address: string;
  age: number;
  createdAt: string;
  fatherName: string;
  gender: string;
  joiningDate: string;
  lastPaidDate: string | null;
  libraryId: string;
  mobile: string;
  name: string;
  nextDueDate: string;
  rollNumber: string;
  shift: string;
  __v: number;
}

interface RootState {
  [x: string]: any;
  student: {
    selectedStudent: StudentData | null;
  };
}

interface PaymentScreenProps {
  navigation: any;
}

const monthOptions = [
  { value: 1, label: '1 Month', color: Colors.primary },
  { value: 2, label: '2 Months', color: Colors.secondary },
  { value: 3, label: '3 Months', color: Colors.success },
  { value: 4, label: '4 Months', color: Colors.warning },
  { value: 5, label: '5 Months', color: Colors.error },
  { value: 6, label: '6 Months', color: Colors.neon },
];

export const StudentPaymentScreen: React.FC<PaymentScreenProps> = ({
  navigation,
}) => {
  useHideTabBarOnKeyboard(navigation);
  const studentData = useSelector((state: RootState) => state.payment.student);
  const [monthlyAmount, setMonthlyAmount] = useState('500');
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [newDueDate, setNewDueDate] = useState(new Date());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const { token } = useSelector((state: RootState) => state.auth);

  const libId = useSelector((state: RootState) => state?.auth?.library?._id);
  // New date range states
  const [fromMonth, setFromMonth] = useState(new Date());
  const [toMonth, setToMonth] = useState(new Date());

  // Discount and Payment Mode states
  const [isDiscountEnabled, setIsDiscountEnabled] = useState(false);
  const [discountAmount, setDiscountAmount] = useState('0');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'online'>('cash');
  const [discountAnim] = useState(new Animated.Value(0));
  const [notes, setNotes] = useState('');

  // Calculate amounts
  const baseAmount = (parseFloat(monthlyAmount) || 500) * selectedMonths;
  const discount = isDiscountEnabled ? parseFloat(discountAmount) || 0 : 0;
  const totalAmount = Math.max(0, baseAmount - discount);

  // Check if student data exists
  useEffect(() => {
    if (!studentData) {
      Alert.alert(
        'Error',
        'No student data found. Please select a student first.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
      return;
    }
  }, [studentData, navigation]);

  // Animation setup
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Initialize date range based on current due date
  useEffect(() => {
    if (studentData?.nextDueDate) {
      const currentDueDate = new Date(studentData.nextDueDate);
      setFromMonth(new Date(currentDueDate));

      // Set toMonth based on selected months
      const calculatedToDate = new Date(currentDueDate);
      calculatedToDate.setMonth(
        calculatedToDate.getMonth() + selectedMonths - 1,
      );
      setToMonth(calculatedToDate);
    }
  }, [studentData?.nextDueDate, selectedMonths]);

  // Calculate new due date
  useEffect(() => {
    if (studentData?.nextDueDate) {
      const currentDueDate = new Date(studentData.nextDueDate);
      const calculatedDate = new Date(currentDueDate);
      calculatedDate.setMonth(calculatedDate.getMonth() + selectedMonths);
      setNewDueDate(calculatedDate);
    }
  }, [selectedMonths, studentData?.nextDueDate]);

  // Update toMonth when fromMonth or selectedMonths changes
  useEffect(() => {
    const calculatedToDate = new Date(fromMonth);
    calculatedToDate.setMonth(calculatedToDate.getMonth() + selectedMonths - 1);
    setToMonth(calculatedToDate);
  }, [fromMonth, selectedMonths]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateYYYYMMDD = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatCurrency = (value: number) => `₹${value.toFixed(0)}`;

  const toggleDiscount = () => {
    const newValue = !isDiscountEnabled;
    setIsDiscountEnabled(newValue);

    if (newValue) {
      Animated.timing(discountAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(discountAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setDiscountAmount('0');
      });
    }
  };

  const handlePayment = async () => {
    const payload: CreatePaymentPayload = {
      libraryId: libId,
      studentId: studentData?._id,
      amount: parseInt(monthlyAmount),
      discount: parseInt(discountAmount),
      paymentMethod: paymentMode,
      fromMonth: fromMonth.toISOString(),
      toMonth: toMonth.toISOString(),
      nextDueDate: newDueDate.toISOString(),
    };
    if (notes !== '' && notes.trim()) {
      payload.notes = notes;
    }

    setAuthToken(token);

    try {
      const data = await createPayment(payload);
      Alert.alert('Success', `Payment created: ₹${data.amount}`);
    } catch (err) {
      Alert.alert('Error', 'Failed to create payment');
      console.error(err);
    }
  };

  const InfoRow = ({
    label,
    value,
    priority = false,
  }: {
    label: string;
    value: string;
    priority?: boolean;
  }) => (
    <View style={[styles.infoRow, priority && styles.priorityRow]}>
      <Text style={[styles.infoLabel, priority && styles.priorityLabel]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, priority && styles.priorityValue]}>
        {value}
      </Text>
    </View>
  );

  if (!studentData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No student data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.button}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              onPress={() => navigation?.goBack()}
            >
              <Icon name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Payment Details</Text>
            <Text style={styles.headerSubtitle}>Library Fee Payment</Text>
          </View>

          {/* Student Information Card */}
          <View style={styles.studentCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Student Information</Text>
              <View style={styles.rollNumberBadge}>
                <Text style={styles.rollNumberText}>
                  {studentData.rollNumber}
                </Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <InfoRow label="Name" value={studentData.name} priority />
              <InfoRow label="Mobile" value={studentData.mobile} priority />
              <InfoRow label="Aadhar" value={studentData.aadhar} priority />
              <InfoRow label="Father's Name" value={studentData.fatherName} />
              <InfoRow label="Age" value={`${studentData.age} years`} />
              <InfoRow label="Gender" value={studentData.gender} />
              <InfoRow label="Shift" value={studentData.shift} />
              <InfoRow label="Address" value={studentData.address} />
              <InfoRow
                label="Joining Date"
                value={formatDate(studentData.joiningDate)}
              />
              <InfoRow
                label="Current Due Date"
                value={formatDate(studentData.nextDueDate)}
                priority
              />
              <InfoRow
                label="Last Paid Date"
                value={
                  studentData.lastPaidDate
                    ? formatDate(studentData.lastPaidDate)
                    : 'Not Available'
                }
              />
            </View>
          </View>

          {/* Payment Section */}
          <View style={styles.paymentCard}>
            <Text style={styles.cardTitle}>Payment Configuration</Text>

            {/* Amount Input */}
            <View style={styles.amountSection}>
              <Text style={styles.sectionLabel}>Monthly Payment Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  value={monthlyAmount}
                  onChangeText={setMonthlyAmount}
                  keyboardType="numeric"
                  placeholder="500"
                  placeholderTextColor={Colors.textSecondary}
                />
                <Text style={styles.currencyText}>/Month</Text>
              </View>

              <View style={styles.totalAmountDisplay}>
                <Text style={styles.totalAmountLabel}>Total Amount:</Text>
                <Text style={styles.totalAmountValue}>
                  {formatCurrency(totalAmount)}
                </Text>
              </View>
            </View>

            {/* Duration Selection */}
            <View style={styles.durationSection}>
              <Text style={styles.sectionLabel}>Payment Duration</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsContainer}
              >
                {monthOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.monthOption,
                      selectedMonths === option.value && {
                        backgroundColor: option.color,
                        borderColor: option.color,
                      },
                    ]}
                    onPress={() => setSelectedMonths(option.value)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.monthOptionText,
                        selectedMonths === option.value &&
                          styles.selectedMonthText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Payment Period Section */}
            <View style={styles.paymentPeriodSection}>
              <Text style={styles.sectionLabel}>Payment Period</Text>

              <View style={styles.dateRangeContainer}>
                <View style={styles.dateFieldContainer}>
                  <Text style={styles.dateFieldLabel}>From Month</Text>
                  <DatePicker
                    label="Start Month"
                    value={fromMonth}
                    onChange={setFromMonth}
                    icon={false}
                    containerStyle={styles.datePickerContainer}
                    minimumDate={new Date()}
                  />
                  {/* <Text style={styles.dateDisplayText}>
                    {formatDateYYYYMMDD(fromMonth)}
                  </Text> */}
                </View>

                <View style={styles.dateSeparator}>
                  <Text style={styles.dateSeparatorText}>to</Text>
                </View>

                <View style={styles.dateFieldContainer}>
                  <Text style={styles.dateFieldLabel}>To Month</Text>
                  <DatePicker
                    label="End Month"
                    value={toMonth}
                    onChange={setToMonth}
                    icon={false}
                    containerStyle={styles.datePickerContainer}
                    minimumDate={fromMonth}
                  />
                  {/* <Text style={styles.dateDisplayText}>
                    {formatDateYYYYMMDD(toMonth)}
                  </Text> */}
                </View>
              </View>
            </View>

            {/* New Due Date */}
            <View style={styles.dueDateSection}>
              <Text style={styles.sectionLabel}>New Due Date</Text>
              <DatePicker
                label="Updated Due Date"
                value={newDueDate}
                onChange={setNewDueDate}
                containerStyle={styles.datePickerContainer}
                minimumDate={new Date()}
              />
            </View>

            {/* Discount Section */}
            <DiscountSection
              isEnabled={isDiscountEnabled}
              amount={discountAmount}
              onToggle={toggleDiscount}
              onAmountChange={setDiscountAmount}
              discountAnim={discountAnim}
            />

            {/* Payment Mode Selection */}
            <PaymentModeSelector
              selectedMode={paymentMode}
              onModeChange={setPaymentMode}
            />
          </View>

          <NotesInput value={notes} onChange={setNotes} />

          {/* Payment Summary */}
          <PaymentSummary
            monthlyAmount={parseFloat(monthlyAmount) || 500}
            selectedMonths={selectedMonths}
            baseAmount={baseAmount}
            discount={discount}
            totalAmount={totalAmount}
            paymentMode={paymentMode}
            currentDueDate={studentData.nextDueDate}
            newDueDate={newDueDate.toISOString()}
            notes={notes}
          />

          {/* Payment Button */}
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={handlePayment}
            activeOpacity={0.8}
          >
            <Text style={styles.paymentButtonText}>
              Process Payment • {formatCurrency(totalAmount)}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: FontSizes.medium,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: Spacing.xs,
  },
  studentCard: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: Radius.lg,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cardTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  rollNumberBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
  },
  rollNumberText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: FontSizes.small,
  },
  cardContent: {
    padding: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  priorityRow: {
    backgroundColor: Colors.background,
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
  },
  infoLabel: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    flex: 1,
  },
  priorityLabel: {
    fontWeight: '600',
    color: Colors.primary,
  },
  infoValue: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  priorityValue: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  paymentCard: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    marginTop: 0,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  amountSection: {
    marginTop: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  button: {
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    position: 'absolute',
    marginLeft: Spacing.md,
    marginTop: Spacing.md,
    // top: 20,
    // left: 20,
    width: 50,
    // marginLeft: Spacing.md,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  currencySymbol: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
  },
  currencyText: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  totalAmountDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  totalAmountLabel: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.primary,
  },
  totalAmountValue: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  durationSection: {
    marginTop: Spacing.lg,
  },
  optionsContainer: {
    paddingVertical: Spacing.sm,
  },
  monthOption: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + Spacing.xs,
    marginRight: Spacing.md,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  monthOptionText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  selectedMonthText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  paymentPeriodSection: {
    marginTop: Spacing.lg,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateFieldContainer: {
    flex: 1,
  },
  dateFieldLabel: {
    fontSize: FontSizes.small,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  dateSeparator: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateSeparatorText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dateDisplayText: {
    fontSize: FontSizes.small,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: Spacing.xs,
    padding: Spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
  },
  dueDateSection: {
    // marginTop: Spacing.sm,
  },
  datePickerContainer: {
    marginTop: Spacing.sm,
  },
  paymentButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.sm + Spacing.xs,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  paymentButtonText: {
    color: Colors.white,
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: FontSizes.large,
    color: Colors.error,
    textAlign: 'center',
    fontWeight: '600',
  },
});
