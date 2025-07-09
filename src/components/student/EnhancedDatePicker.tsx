'use client';

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface EnhancedDatePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  icon?: string;
  containerStyle?: any;
  required?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  helperText?: string;
  showAge?: boolean;
  age?: number;
  disabled?: boolean;
}

export const EnhancedDatePicker: React.FC<EnhancedDatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  icon,
  containerStyle,
  required = false,
  minimumDate,
  maximumDate,
  helperText,
  showAge = false,
  age,
  disabled = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Enhanced animations
  const containerScale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);
  const borderColor = useSharedValue(0);
  const modalOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);

  React.useEffect(() => {
    borderColor.value = withTiming(error ? 2 : isFocused ? 1 : 0, {
      duration: 200,
    });

    shadowOpacity.value = withTiming(isFocused ? 0.3 : 0.1, {
      duration: 200,
    });
  }, [isFocused, error]);

  const formatDate = (date: Date) => {
    try {
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const newDate =
      selectedDate instanceof Date && !isNaN(selectedDate.getTime())
        ? selectedDate
        : value;

    if (Platform.OS === 'android') {
      setShowPicker(false);
      setIsFocused(false);
      containerScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }

    if (event.type === 'set') {
      onChange(newDate);
    }
  };

  const handlePress = () => {
    setShowPicker(true);
    setIsFocused(true);
    containerScale.value = withSpring(1.02, { damping: 15, stiffness: 200 });

    if (Platform.OS === 'ios') {
      modalOpacity.value = withTiming(1, { duration: 200 });
      modalScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }
  };

  const closePicker = () => {
    if (Platform.OS === 'ios') {
      modalOpacity.value = withTiming(0, { duration: 150 });
      modalScale.value = withSpring(0.8, { damping: 15, stiffness: 200 });

      setTimeout(() => {
        setShowPicker(false);
        setIsFocused(false);
        containerScale.value = withSpring(1, { damping: 15, stiffness: 200 });
      }, 150);
    }
  };

  const displayDate =
    value instanceof Date && !isNaN(value.getTime()) ? value : new Date();

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    shadowOpacity: shadowOpacity.value,
    borderColor: interpolateColor(
      borderColor.value,
      [0, 1, 2],
      [Colors.border, Colors.primary, Colors.error],
    ),
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Animated.View style={[styles.inputContainer, containerAnimatedStyle]}>
          {icon && (
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
          )}

          <View style={[styles.input, { paddingLeft: icon ? 48 : 16 }]}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formatDate(displayDate)}</Text>
              {showAge && age !== undefined && (
                <Text style={styles.ageText}>({age} years old)</Text>
              )}
            </View>
            <Text style={styles.calendarIcon}>📅</Text>
          </View>

          <Text style={[styles.label, { left: icon ? 48 : 16 }]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      {error && (
        <Animated.View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </Animated.View>
      )}

      {helperText && !error && (
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>💡 {helperText}</Text>
        </View>
      )}

      {Platform.OS === 'ios' ? (
        <Modal visible={showPicker} transparent animationType="none">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closePicker}
          >
            <Animated.View style={[styles.modalContent, modalAnimatedStyle]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity
                  onPress={closePicker}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                mode="date"
                value={displayDate}
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                display="spinner"
                style={styles.iosDatePicker}
              />

              <TouchableOpacity style={styles.doneButton} onPress={closePicker}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            mode="date"
            value={displayDate}
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            display="default"
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    minHeight: 56,
    justifyContent: 'center',
    position: 'relative',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingTop: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 4,
  },
  ageText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  calendarIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  label: {
    position: 'absolute',
    top: 6,
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    fontWeight: '500',
    backgroundColor: Colors.white,
    paddingHorizontal: 4,
  },
  iconContainer: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  icon: {
    fontSize: 20,
  },
  errorContainer: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.small,
    fontWeight: '500',
  },
  helperContainer: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  helperText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.small,
  },
  required: {
    color: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingBottom: 30,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.primary,
    flex: 1,
  },
  closeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.md,
  },
  closeButtonText: {
    fontSize: FontSizes.large,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  iosDatePicker: {
    height: 200,
    backgroundColor: Colors.white,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  doneButtonText: {
    color: Colors.white,
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
});
