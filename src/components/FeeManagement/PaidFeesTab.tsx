// components/FeeManagement/PaidFeesTab.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import dayjs from 'dayjs';
import { Colors, Spacing, FontSizes } from '../../theme/theme';
import PaidStudentCard from './PaidStudentCard';

interface PaidStudent {
  name: string;
  rollNumber: string;
  paidDate: string;
  amount: number;
}

interface PaidFeesTabProps {
  students: PaidStudent[];
}

const PaidFeesTab: React.FC<PaidFeesTabProps> = ({ students }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const sortedStudents = [...students].sort((a, b) =>
    dayjs(b.paidDate).diff(dayjs(a.paidDate)),
  );

  const totalAmount = students.reduce(
    (sum, student) => sum + student.amount,
    0,
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Recent Payments</Text>
          <Text style={styles.totalAmount}>
            Total: ₹{totalAmount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{students.length}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sortedStudents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💰</Text>
            <Text style={styles.emptyTitle}>No Recent Payments</Text>
            <Text style={styles.emptySubtitle}>Paid fees will appear here</Text>
          </View>
        ) : (
          sortedStudents.map((student, index) => (
            <PaidStudentCard
              key={`${student.rollNumber}-${student.paidDate}`}
              student={student}
              index={index}
            />
          ))
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  totalAmount: {
    fontSize: FontSizes.medium,
    color: Colors.success,
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: Colors.success,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minWidth: 40,
    alignItems: 'center',
  },
  countText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default PaidFeesTab;
