import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import dayjs from 'dayjs';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface PaidStudent {
  name: string;
  rollNumber: string;
  paidDate: string;
  amount: number;
}

interface PaidStudentCardProps {
  student: PaidStudent;
  index: number;
}

const PaidStudentCard: React.FC<PaidStudentCardProps> = ({
  student,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const getDaysAgo = () => {
    const daysAgo = dayjs().diff(dayjs(student.paidDate), 'day');
    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return 'Yesterday';
    return `${daysAgo} days ago`;
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <View style={styles.successIcon}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.rollNumber}>Roll: {student.rollNumber}</Text>
            <Text style={styles.paidDate}>
              {dayjs(student.paidDate).format('DD MMM')}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.amount}>₹{student.amount}</Text>
          <Text style={styles.timeAgo}>{getDaysAgo()}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  checkMark: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  rollNumber: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
  },
  paidDate: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.success,
  },
  timeAgo: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
  },
});

export default PaidStudentCard;
