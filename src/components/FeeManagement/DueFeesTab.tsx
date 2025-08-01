// components/FeeManagement/DueFeesTab.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import dayjs from 'dayjs';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
import DueStudentCard from './DueStudentCard';
import { getDueFees } from '../../apis/api'; // <-- API to fetch due students

interface Student {
  name: string;
  rollNumber: string;
  nextDueDate: string; // from API
  mobile?: string;
  shift?: string;
  amount?: number;
}

interface StudentWithStatus extends Student {
  dueDate: string; // 👈 added explicitly
  daysLeft: number;
  isOverdue: boolean;
}

const DueFeesTab: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const fetchDueStudents = async () => {
      try {
        const data = await getDueFees();

        setStudents(data); // data should be array of students with nextDueDate
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to load due students');
      } finally {
        setLoading(false);
      }
    };

    fetchDueStudents();
  }, []);

  const processStudents = (): StudentWithStatus[] => {
    const today = dayjs();

    const studentsWithStatus: StudentWithStatus[] = students.map(student => {
      const dueDate = student.nextDueDate; // 👈 fix: alias here
      const dueDay = dayjs(dueDate);
      const daysLeft = dueDay.diff(today, 'day');
      const isOverdue = daysLeft < 0;

      return {
        ...student,
        dueDate, // 👈 now DueStudentCard gets the expected field
        daysLeft,
        isOverdue,
      };
    });

    const filtered = studentsWithStatus.filter(
      s => s.isOverdue || s.daysLeft <= 7,
    );

    return filtered.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      return a.daysLeft - b.daysLeft;
    });
  };

  const sortedStudents = processStudents();

  if (loading) {
    return (
      <View style={styles.emptyState}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.emptySubtitle}>Loading due students...</Text>
      </View>
    );
  }

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
              key={`${student.rollNumber}-${student.nextDueDate}`}
              student={student}
              index={index}
            />
          ))
        )}
      </ScrollView>
    </Animated.View>
  );
};

export default DueFeesTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
    shadowOffset: { width: 0, height: 2 },
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
    paddingBottom: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
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
