import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import dayjs from 'dayjs';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface StudentWithStatus {
  name: string;
  rollNumber: string;
  dueDate: string;
  daysLeft: number;
  isOverdue: boolean;
  mobile?: string;
  amount?: number;
}

interface DueStudentCardProps {
  student: StudentWithStatus;
  index: number;
}

const DueStudentCard: React.FC<DueStudentCardProps> = ({ student, index }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [index]);

  const formatPhoneNumber = (phone: string): string => {
    const clean = phone.replace(/\D/g, '');
    return clean.startsWith('91') ? clean : `91${clean}`;
  };

  const generateWhatsAppMessage = (): string => {
    const { name, amount = 0, daysLeft, isOverdue } = student;
    const dueAmount = amount.toLocaleString('en-IN');
    return isOverdue
      ? `Hi ${name},\n\nThis is a gentle reminder that your fee payment of ₹${dueAmount} was due ${Math.abs(
          daysLeft,
        )} day${
          Math.abs(daysLeft) > 1 ? 's' : ''
        } ago.\n\nPlease make the payment soon.\n\nThank you!`
      : `Hi ${name},\n\nThis is a reminder that your fee of ₹${dueAmount} is due in ${daysLeft} day${
          daysLeft > 1 ? 's' : ''
        }.\n\nKindly pay on time.\n\nThanks!`;
  };

  const handleWhatsAppPress = async () => {
    if (!student.mobile) return;

    const phone = formatPhoneNumber(student.mobile);
    const msg = encodeURIComponent(generateWhatsAppMessage());
    const url = `whatsapp://send?phone=${phone}&text=${msg}`;
    const fallback = `https://wa.me/${phone}?text=${msg}`;

    try {
      const supported = await Linking.canOpenURL(url);
      await Linking.openURL(supported ? url : fallback);
    } catch (err) {
      console.error('WhatsApp error:', err);
    }
  };

  const getStatusColor = () =>
    student.isOverdue
      ? Colors.error
      : student.daysLeft <= 2
      ? Colors.warning
      : Colors.success;

  const getStatusText = () =>
    student.isOverdue
      ? `${Math.abs(student.daysLeft)} day${
          Math.abs(student.daysLeft) > 1 ? 's' : ''
        } overdue`
      : `${student.daysLeft} day${student.daysLeft > 1 ? 's' : ''} left`;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animatedValue,
          transform: [
            { scale: scaleValue },
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.mainContent}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.rollNumber}>Roll: {student.rollNumber}</Text>
            <Text style={styles.dueDate}>
              Due: {dayjs(student.dueDate).format('DD MMM YYYY')}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() },
              ]}
            >
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
            {student.amount && (
              <Text style={styles.amountText}>
                ₹{student.amount.toLocaleString('en-IN')}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.bottomSection}>
          {student?.mobile && (
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={handleWhatsAppPress}
              activeOpacity={0.7}
            >
              <FontAwesome name="whatsapp" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  rollNumber: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  dueDate: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
  amountText: {
    fontSize: FontSizes.small,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // minHeight: 24,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    position: 'absolute',
    right: 0,
    bottom: -8,
    elevation: 4,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default DueStudentCard;
