import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface PaymentMode {
  value: string;
  label: string;
}

interface PaymentModeSelectorProps {
  selectedMode: 'cash' | 'online';
  onModeChange: (mode: 'cash' | 'online') => void;
}

const paymentModes: PaymentMode[] = [
  { value: 'cash', label: 'Cash Payment' },
  { value: 'online', label: 'Online Payment' },
];

export const PaymentModeSelector: React.FC<PaymentModeSelectorProps> = ({
  selectedMode,
  onModeChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Payment Mode</Text>
      <View style={styles.radioGroup}>
        {paymentModes.map(mode => (
          <TouchableOpacity
            key={mode.value}
            style={styles.radioOption}
            onPress={() => {
              if (mode.value === 'cash' || mode.value === 'online') {
                onModeChange(mode.value);
              }
            }}
            activeOpacity={0.7}
          >
            <View style={styles.radioCircle}>
              {selectedMode === mode.value && (
                <View style={styles.radioSelected} />
              )}
            </View>
            <Text style={styles.radioLabel}>{mode.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  radioGroup: {
    gap: Spacing.sm,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});
