import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface DiscountSectionProps {
  isEnabled: boolean;
  amount: string;
  onToggle: () => void;
  onAmountChange: (amount: string) => void;
  discountAnim: Animated.Value;
}

export const DiscountSection: React.FC<DiscountSectionProps> = ({
  isEnabled,
  amount,
  onToggle,
  onAmountChange,
  discountAnim,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>Apply Discount</Text>
        <TouchableOpacity
          style={[styles.toggle, isEnabled && styles.toggleActive]}
          onPress={onToggle}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.toggleThumb,
              {
                transform: [
                  {
                    translateX: isEnabled ? 20 : 2,
                  },
                ],
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      {isEnabled && (
        <Animated.View
          style={[
            styles.inputContainer,
            {
              opacity: discountAnim,
            },
          ]}
        >
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={onAmountChange}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.textSecondary}
            />
            <Text style={styles.discountText}>Discount</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleActive: {
    backgroundColor: Colors.success,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    position: 'absolute',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  inputContainer: {
    marginTop: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.warning,
    paddingHorizontal: Spacing.md,
  },
  currencySymbol: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
  },
  discountText: {
    fontSize: FontSizes.medium,
    color: Colors.warning,
    fontWeight: '600',
  },
});
