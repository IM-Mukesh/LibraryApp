// components/FeeManagement/ProfessionalDueCard.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
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
}

interface ProfessionalDueCardProps {
  student: StudentWithStatus;
  index: number;
}

const { width } = Dimensions.get('window');

const ProfessionalDueCard: React.FC<ProfessionalDueCardProps> = ({
  student,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for overdue cards
    if (student.isOverdue) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [index, student.isOverdue]);

  const handleWhatsAppPress = () => {
    if (!student.phone) {
      Alert.alert(
        '📞 Phone Number Missing',
        `No phone number available for ${student.name}`,
        [{ text: 'OK', style: 'default' }],
      );
      return;
    }

    const formatMessage = () => {
      const studentName = student.name;
      const dueDate = dayjs(student.dueDate).format('DD MMM YYYY');
      const isOverdue = student.isOverdue;
      const days = Math.abs(student.daysLeft);

      if (isOverdue) {
        return `Hi ${studentName},\n\nYour fee payment was due on ${dueDate} (${days} day${
          days !== 1 ? 's' : ''
        } ago). Please make the payment immediately to avoid any complications.\n\nRegards,\nFee Management Team`;
      } else {
        return `Hi ${studentName},\n\nFriendly reminder: Your fee payment is due on ${dueDate} (in ${days} day${
          days !== 1 ? 's' : ''
        }). Please ensure timely payment.\n\nRegards,\nFee Management Team`;
      }
    };

    const message = formatMessage();
    const phoneNumber = student.phone.replace(/[^\d+]/g, '');
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message,
    )}`;

    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            '📱 WhatsApp Not Available',
            'Please install WhatsApp to send messages',
            [{ text: 'OK', style: 'default' }],
          );
        }
      })
      .catch(err => {
        Alert.alert('❌ Error', 'Failed to open WhatsApp');
        console.error('WhatsApp error:', err);
      });
  };

  const getStatusInfo = () => {
    if (student.isOverdue) {
      const overdueDays = Math.abs(student.daysLeft);
      return {
        text: `${overdueDays} day${overdueDays !== 1 ? 's' : ''} overdue`,
        icon: '🚨',
        bgColor: Colors.error,
        textColor: Colors.white,
        urgency: 'high',
      };
    } else if (student.daysLeft === 0) {
      return {
        text: 'Due Today',
        icon: '⏰',
        bgColor: Colors.warning,
        textColor: Colors.white,
        urgency: 'medium',
      };
    } else {
      return {
        text: `${student.daysLeft} day${
          student.daysLeft !== 1 ? 's' : ''
        } left`,
        icon: '📅',
        bgColor: Colors.secondary,
        textColor: Colors.white,
        urgency: 'low',
      };
    }
  };

  const statusInfo = getStatusInfo();

  const cardStyle = [
    styles.card,
    student.isOverdue && styles.overdueCard,
    {
      opacity: fadeAnim,
      transform: [
        { translateY: slideAnim },
        { scale: scaleAnim },
        ...(student.isOverdue ? [{ scale: pulseAnim }] : []),
      ],
    },
  ];

  return (
    <Animated.View style={cardStyle}>
      {/* Status Indicator Strip */}
      <View
        style={[styles.statusStrip, { backgroundColor: statusInfo.bgColor }]}
      />

      <View style={styles.cardContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName} numberOfLines={1}>
              {student.name}
            </Text>
            <Text style={styles.rollNumber}>ID: {student.rollNumber}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusInfo.bgColor },
            ]}
          >
            <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.dateInfo}>
            <Text style={styles.dueDateLabel}>Due Date</Text>
            <Text style={styles.dueDate}>
              {dayjs(student.dueDate).format('DD MMM YYYY')}
            </Text>
          </View>

          <View style={styles.statusInfo}>
            <Text style={[styles.statusText, { color: statusInfo.bgColor }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        {/* Action Section */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.whatsappButton,
              !student.phone && styles.disabledButton,
            ]}
            onPress={handleWhatsAppPress}
            activeOpacity={0.8}
            disabled={!student.phone}
          >
            <View style={styles.whatsappContent}>
              <Text style={styles.whatsappIcon}>💬</Text>
              <Text style={styles.whatsappText}>
                {student.phone ? 'Send Reminder' : 'No Phone'}
              </Text>
            </View>
            {student.phone && (
              <View style={styles.whatsappArrow}>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  overdueCard: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  statusStrip: {
    height: 4,
    width: '100%',
  },
  cardContent: {
    padding: Spacing.lg,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  studentInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  studentName: {
    fontSize: FontSizes.large,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  rollNumber: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 18,
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
  dateInfo: {
    flex: 1,
  },
  dueDateLabel: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  dueDate: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  statusInfo: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: FontSizes.small,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionSection: {
    marginTop: Spacing.sm,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#25D366',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    minHeight: 48,
  },
  disabledButton: {
    backgroundColor: Colors.disabled,
  },
  whatsappContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  whatsappIcon: {
    fontSize: FontSizes.medium,
    marginRight: Spacing.sm,
  },
  whatsappText: {
    color: Colors.white,
    fontSize: FontSizes.medium,
    fontWeight: '600',
    flex: 1,
  },
  whatsappArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProfessionalDueCard;
