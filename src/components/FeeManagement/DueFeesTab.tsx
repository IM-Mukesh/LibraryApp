// components/FeeManagement/DueFeesTab.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import dayjs from 'dayjs';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
import DueStudentCard from './DueStudentCard';

interface Student {
  name: string;
  rollNumber: string;
  dueDate: string;
  phone?: string;
  amount?: number; // Added amount for WhatsApp message
}

interface StudentWithStatus extends Student {
  daysLeft: number;
  isOverdue: boolean;
}

interface DueFeesTabProps {
  students: Student[];
}

const DueFeesTab: React.FC<DueFeesTabProps> = ({ students }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current; // Reduced slide distance

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // Faster animation
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const processStudents = (): StudentWithStatus[] => {
    const today = dayjs();

    const studentsWithStatus: StudentWithStatus[] = students.map(student => {
      const dueDate = dayjs(student.dueDate);
      const daysLeft = dueDate.diff(today, 'day');
      const isOverdue = daysLeft < 0;

      return {
        ...student,
        daysLeft,
        isOverdue,
      };
    });

    // Filter: overdue or due within 7 days
    const filteredStudents = studentsWithStatus.filter(
      student => student.isOverdue || student.daysLeft <= 7,
    );

    // Sort: overdue first, then by days left
    return filteredStudents.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      if (a.isOverdue && b.isOverdue) return a.daysLeft - b.daysLeft;
      return a.daysLeft - b.daysLeft;
    });
  };

  const sortedStudents = processStudents();

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
        <Text style={styles.title}>Due Payments</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{sortedStudents.length}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sortedStudents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>
              No pending payments at the moment
            </Text>
          </View>
        ) : (
          sortedStudents.map((student, index) => (
            <DueStudentCard
              key={`${student.rollNumber}-${student.dueDate}`}
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
    paddingHorizontal: Spacing.md, // Reduced padding
    marginTop: Spacing.sm, // Reduced top margin
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md, // Reduced margin
    paddingVertical: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: Colors.error,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 32,
    alignItems: 'center',
    shadowColor: Colors.error,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  countText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.lg, // Reduced padding
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48, // Smaller icon
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default DueFeesTab;
