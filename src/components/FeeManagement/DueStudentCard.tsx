// components/FeeManagement/DueStudentCard.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import dayjs from 'dayjs';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface StudentWithStatus {
  name: string;
  rollNumber: string;
  dueDate: string;
  daysLeft: number;
  isOverdue: boolean;
  phone?: string;
  amount?: number; // Added for WhatsApp message
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
    // Remove any non-digit characters and ensure it starts with country code
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('91')) {
      return cleanPhone;
    }
    return `91${cleanPhone}`;
  };

  const generateWhatsAppMessage = (): string => {
    const { name, amount = 0, daysLeft, isOverdue } = student;
    const dueAmount = amount.toLocaleString('en-IN');

    if (isOverdue) {
      return `Hi ${name},\n\nThis is a gentle reminder that your fee payment of ₹${dueAmount} was due ${Math.abs(
        daysLeft,
      )} day${
        Math.abs(daysLeft) > 1 ? 's' : ''
      } ago.\n\nPlease make the payment at your earliest convenience to avoid any inconvenience.\n\nThank you!`;
    } else {
      return `Hi ${name},\n\nThis is a friendly reminder that your fee payment of ₹${dueAmount} is due in ${daysLeft} day${
        daysLeft > 1 ? 's' : ''
      }.\n\nPlease ensure timely payment to avoid any late fees.\n\nThank you!`;
    }
  };

  const handleWhatsAppPress = async () => {
    if (!student.phone) return;

    const phoneNumber = formatPhoneNumber(student.phone);
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl =
      Platform.OS === 'ios'
        ? `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`
        : `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback to web WhatsApp
        const webWhatsApp = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        await Linking.openURL(webWhatsApp);
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  };

  const getStatusColor = () => {
    if (student.isOverdue) return Colors.error;
    if (student.daysLeft <= 2) return Colors.warning;
    return Colors.success;
  };

  const getStatusText = () => {
    if (student.isOverdue) {
      return `${Math.abs(student.daysLeft)} day${
        Math.abs(student.daysLeft) > 1 ? 's' : ''
      } overdue`;
    }
    return `${student.daysLeft} day${student.daysLeft > 1 ? 's' : ''} left`;
  };

  const getAlertMessage = () => {
    if (student.isOverdue) {
      return 'Payment Overdue';
    }
    if (student.daysLeft <= 2) {
      return 'Due Soon';
    }
    return 'Upcoming Due';
  };

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
          {/* <View
            style={[
              styles.alertBadge,
              { backgroundColor: `${getStatusColor()}15` },
            ]}
          >
            <Text style={[styles.alertText, { color: getStatusColor() }]}>
              {getAlertMessage()}
            </Text>
          </View> */}

          {student.phone && (
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={handleWhatsAppPress}
              activeOpacity={0.7}
            >
              <Text style={styles.whatsappIcon}>💬</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm, // Reduced spacing between cards
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    fontSize: 11, // Smaller text
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
  },
  alertBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    flex: 1,
    marginRight: Spacing.sm,
  },
  alertText: {
    fontSize: 11, // Smaller alert text
    fontWeight: '500',
    textAlign: 'center',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    shadowColor: '#25D366',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    position: 'absolute',
    right: 0,
    bottom: -8,
  },
  whatsappIcon: {
    fontSize: 16,
  },
});

export default DueStudentCard;
