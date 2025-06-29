// src/components/DatePickerBottomSheet.tsx
import React, { useCallback, useMemo, forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import DatePicker from 'react-native-date-picker';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
import AnimatedButton from './AnimatedButton';

interface DatePickerBottomSheetProps {
  date: Date;
  onDateChange: (date: Date) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
}

const DatePickerBottomSheet = forwardRef<
  BottomSheet,
  DatePickerBottomSheetProps
>(({ date, onDateChange, onConfirm, onCancel, title }, ref) => {
  const snapPoints = useMemo(() => ['50%'], []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onCancel();
      }
    },
    [onCancel],
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.datePickerContainer}>
          <DatePicker
            date={date}
            onDateChange={onDateChange}
            mode="date"
            theme="light" // or "dark"
            locale="en" // optional
            maximumDate={new Date()} // optional
            minimumDate={new Date('1900-01-01')} // optional
          />
        </View>

        <View style={styles.buttonContainer}>
          <AnimatedButton
            title="Cancel"
            onPress={onCancel}
            style={[styles.button, styles.cancelButton]}
          />
          <AnimatedButton
            title="Confirm"
            onPress={onConfirm}
            style={[styles.button, styles.confirmButton]}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
  },
  handleIndicator: {
    backgroundColor: Colors.border,
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  datePickerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    // Custom styling for cancel button if needed
  },
  confirmButton: {
    // Custom styling for confirm button if needed
  },
});

export default DatePickerBottomSheet;
