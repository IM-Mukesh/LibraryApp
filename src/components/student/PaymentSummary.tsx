// components/student/PaymentSummary.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface PaymentSummaryProps {
  monthlyAmount: number;
  selectedMonths: number;
  baseAmount: number;
  discount: number;
  totalAmount: number;
  paymentMode: string;
  currentDueDate: string;
  newDueDate: string;
  notes: string;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  monthlyAmount,
  selectedMonths,
  baseAmount,
  discount,
  totalAmount,
  paymentMode,
  currentDueDate,
  newDueDate,
  notes,
}) => {
  const formatCurrency = (value: number) => `₹${value.toFixed(0)}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const SummaryRow = ({
    label,
    value,
    isDiscount = false,
    isTotal = false,
  }: {
    label: string;
    value: string;
    isDiscount?: boolean;
    isTotal?: boolean;
  }) => (
    <View style={[styles.summaryRow, isTotal && styles.totalRow]}>
      <Text
        style={[
          styles.summaryLabel,
          isDiscount && styles.discountLabel,
          isTotal && styles.totalLabel,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.summaryValue,
          isDiscount && styles.discountValue,
          isTotal && styles.totalValue,
        ]}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.cardTitle}>Payment Summary</Text>
      <View style={styles.content}>
        <SummaryRow
          label="Monthly Rate:"
          value={`${formatCurrency(monthlyAmount)}/Month`}
        />
        <SummaryRow
          label="Duration:"
          value={`${selectedMonths} Month${selectedMonths > 1 ? 's' : ''}`}
        />
        <SummaryRow label="Base Amount:" value={formatCurrency(baseAmount)} />
        {discount > 0 && (
          <SummaryRow
            label="Discount:"
            value={`-${formatCurrency(discount)}`}
            isDiscount
          />
        )}
        <SummaryRow
          label="Payment Mode:"
          value={paymentMode === 'cash' ? 'Cash' : 'Online'}
        />
        <SummaryRow label="Current Due:" value={formatDate(currentDueDate)} />
        {notes && <SummaryRow label="Notes:" value={notes} />}
        <SummaryRow
          label="Total Amount:"
          value={formatCurrency(totalAmount)}
          isTotal
        />
        <SummaryRow
          label="New Due Date:"
          value={formatDate(newDueDate)}
          isTotal
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  cardTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  content: {
    marginTop: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  discountLabel: {
    color: Colors.warning,
    fontWeight: '600',
  },
  discountValue: {
    color: Colors.warning,
    fontWeight: 'bold',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  totalValue: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
