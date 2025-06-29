// components/DueFeeList.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import dayjs from 'dayjs';
import { Colors, Spacing, FontSizes, Radius } from '../theme/theme';

interface DueFeeListProps {
  students: {
    name: string;
    rollNumber: string;
    dueDate: string; // ISO string
  }[];
}

interface StudentWithStatus {
  name: string;
  rollNumber: string;
  dueDate: string;
  daysLeft: number;
  isOverdue: boolean;
}

const DueFeeList: React.FC<DueFeeListProps> = ({ students }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 800,
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

    // Sort: overdue first, then upcoming within 7 days
    return studentsWithStatus.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      if (a.isOverdue && b.isOverdue) return a.daysLeft - b.daysLeft; // Most overdue first
      if (!a.isOverdue && !b.isOverdue) return a.daysLeft - b.daysLeft; // Due soon first
      return 0;
    });
  };

  const StudentRow = ({
    student,
    index,
  }: {
    student: StudentWithStatus;
    index: number;
  }) => {
    const itemFadeAnim = useRef(new Animated.Value(0)).current;
    const itemSlideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(itemFadeAnim, {
          toValue: 1,
          duration: 500,
          delay: 1000 + index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(itemSlideAnim, {
          toValue: 0,
          duration: 500,
          delay: 1000 + index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, [index]);

    const getStatusCard = () => {
      if (student.isOverdue) {
        const overdueDays = Math.abs(student.daysLeft);
        return (
          <View style={[styles.statusCard, styles.overdueCard]}>
            <Text style={styles.overdueText}>
              Overdue {overdueDays} day{overdueDays !== 1 ? 's' : ''}
            </Text>
          </View>
        );
      } else if (student.daysLeft <= 7) {
        return (
          <View style={[styles.statusCard, styles.upcomingCard]}>
            <Text style={styles.whatsappIcon}>📱</Text>
            <Text style={styles.upcomingText}>
              Due in {student.daysLeft} day{student.daysLeft !== 1 ? 's' : ''}
            </Text>
          </View>
        );
      }
      return null;
    };

    return (
      <Animated.View
        style={[
          styles.studentRow,
          {
            opacity: itemFadeAnim,
            transform: [{ translateY: itemSlideAnim }],
          },
        ]}
      >
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.rollNumber}>Roll No: {student.rollNumber}</Text>
          <Text style={styles.dueDate}>
            Due: {dayjs(student.dueDate).format('DD MMM YYYY')}
          </Text>
        </View>
        {getStatusCard()}
      </Animated.View>
    );
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
      <Text style={styles.sectionTitle}>Payment Status</Text>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {sortedStudents.map((student, index) => (
          <StudentRow
            key={`${student.rollNumber}-${student.dueDate}`}
            student={student}
            index={index}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  studentRow: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  rollNumber: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  dueDate: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
  },
  statusCard: {
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  overdueCard: {
    backgroundColor: Colors.error,
  },
  upcomingCard: {
    backgroundColor: '#FFF8E1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  overdueText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  upcomingText: {
    color: '#F57F17',
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  whatsappIcon: {
    fontSize: FontSizes.small,
  },
});

export default DueFeeList;
