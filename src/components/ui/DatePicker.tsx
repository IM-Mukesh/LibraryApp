// src/components/ui/DatePicker.tsx
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
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface DatePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  icon?: React.ReactNode;
  containerStyle?: any;
  required?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  icon,
  containerStyle,
  required = false,
  minimumDate,
  maximumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);

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
        : value; // fallback to current value

    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'set') {
      onChange(newDate); // ✅ Pass valid date to parent component
    } else if (event.type === 'dismissed') {
    }
  };

  const handlePress = () => {
    setShowPicker(true);
  };

  // Ensure we have a valid date
  const displayDate =
    value instanceof Date && !isNaN(value.getTime()) ? value : new Date();

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.inputContainer,
          { borderColor: error ? Colors.error : Colors.border },
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View style={[styles.input, { paddingLeft: icon ? 48 : 16 }]}>
          <Text style={styles.dateText}>{formatDate(displayDate)}</Text>
        </View>
        <Text style={[styles.label, { left: icon ? 48 : 16 }]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {icon !== false && (
          <View style={styles.arrow}>
            <Text style={styles.arrowText}>📅</Text>
          </View>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {Platform.OS === 'ios' ? (
        <Modal visible={showPicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
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
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    marginBottom: Spacing.md,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    // minHeight: 56,
    justifyContent: 'center',
    position: 'relative',
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingTop: 20,
    paddingBottom: 8,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: FontSizes.small,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  label: {
    position: 'absolute',
    top: 8,
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  iconContainer: {
    position: 'absolute',
    left: 16,
    top: 20,
    zIndex: 1,
  },
  arrow: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  arrowText: {
    fontSize: 16,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.small,
    marginTop: 4,
    marginLeft: 4,
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
  },
  modalHeader: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  iosDatePicker: {
    height: 200,
    backgroundColor: Colors.white,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  doneButtonText: {
    color: Colors.white,
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
});
