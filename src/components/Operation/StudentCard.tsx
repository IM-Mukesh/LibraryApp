// src/components/StudentCard.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface Student {
  _id: string;
  name: string;
  mobile: string;
  aadhar: string;
  shift: string;
  avatar?: string;
  isEnabled?: boolean;
}

interface StudentCardProps {
  student: Student;
  onPaymentPress: () => void;
  onDetailsPress: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onPaymentPress,
  onDetailsPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dollarScaleAnim = useRef(new Animated.Value(1)).current;
  const arrowScaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  const getInitial = (name: string): string => name.charAt(0).toUpperCase();

  const getShiftColor = (shift: string): string => {
    switch (shift.toLowerCase()) {
      case 'morning':
      case 'first':
        return Colors.success;
      case 'afternoon':
      case 'second':
        return Colors.warning;
      case 'evening':
      case 'third':
        return Colors.primary;
      default:
        return Colors.textSecondary;
    }
  };

  const handleCardPressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getStudentShift = (s: string) => {
    if (s === 'first' || s === 'morning') {
      return 'Morning';
    } else if (s === 'second' || s === 'afternoon') {
      return 'Afternoon';
    } else if (s === 'third' || s === 'evening') {
      return 'Evening';
    }
    return s;
  };

  const handleCardPressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePaymentPressIn = () => {
    Animated.sequence([
      Animated.timing(dollarScaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(dollarScaleAnim, {
        toValue: 1.1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePaymentPressOut = () => {
    Animated.spring(dollarScaleAnim, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  const handleArrowPressIn = () => {
    Animated.timing(arrowScaleAnim, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleArrowPressOut = () => {
    Animated.spring(arrowScaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.primary],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.25],
  });

  const ArrowIcon = () => (
    <View style={styles.arrowIcon}>
      <View style={[styles.arrowLine, styles.arrowLineTop]} />
      <View style={[styles.arrowLine, styles.arrowLineBottom]} />
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handleCardPressIn}
      onPressOut={handleCardPressOut}
      onPress={onDetailsPress}
    >
      <Animated.View
        style={[
          styles.container,
          {
            borderColor,
            shadowOpacity,
            transform: [{ scale: scaleAnim }],
          },
          student.isEnabled === false && styles.disabledCard,
        ]}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <View
              style={[
                styles.avatar,
                student.isEnabled === false && styles.disabledAvatar,
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  student.isEnabled === false && styles.disabledAvatarText,
                ]}
              >
                {getInitial(student.name)}
              </Text>
            </View>
            <View style={styles.info}>
              <Text
                style={[
                  styles.name,
                  student.isEnabled === false && styles.disabledText,
                ]}
                numberOfLines={1}
              >
                {student.name}
              </Text>
              <View style={styles.detailsRow}>
                <View style={styles.shiftContainer}>
                  <View
                    style={[
                      styles.shiftBadge,
                      {
                        backgroundColor: getShiftColor(student.shift) + '20',
                      },
                      student.isEnabled === false && styles.disabledBadge,
                    ]}
                  >
                    <View
                      style={[
                        styles.shiftDot,
                        {
                          backgroundColor: getShiftColor(student.shift),
                        },
                        student.isEnabled === false && styles.disabledDot,
                      ]}
                    />
                    <Text
                      style={[
                        styles.shiftText,
                        {
                          color: getShiftColor(student.shift),
                        },
                        student.isEnabled === false && styles.disabledShiftText,
                      ]}
                    >
                      {getStudentShift(student.shift.toLowerCase())}
                    </Text>
                  </View>
                </View>
                {student.isEnabled === false && (
                  <View style={styles.disabledBadge}>
                    <Text style={styles.disabledBadgeText}>Disabled</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.rightSection}>
            <TouchableOpacity
              style={[
                styles.paymentButton,
                student.isEnabled === false && styles.disabledButton,
              ]}
              onPress={onPaymentPress}
              onPressIn={handlePaymentPressIn}
              onPressOut={handlePaymentPressOut}
              disabled={student.isEnabled === false}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.dollarContainer,
                  { transform: [{ scale: dollarScaleAnim }] },
                  student.isEnabled === false && styles.disabledDollarContainer,
                ]}
              >
                <Text
                  style={[
                    styles.dollarSymbol,
                    student.isEnabled === false && styles.disabledDollarSymbol,
                  ]}
                >
                  ₹
                </Text>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.arrowButton}
              onPress={onDetailsPress}
              onPressIn={handleArrowPressIn}
              onPressOut={handleArrowPressOut}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.arrowContainer,
                  { transform: [{ scale: arrowScaleAnim }] },
                ]}
              >
                <ArrowIcon />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    marginHorizontal: 2,
    marginVertical: Spacing.xs,
  },
  disabledCard: {
    opacity: 0.6,
    backgroundColor: Colors.background,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  disabledAvatar: {
    backgroundColor: Colors.textSecondary,
  },
  avatarText: {
    fontSize: FontSizes.large,
    fontWeight: '700',
    color: Colors.white,
  },
  disabledAvatarText: {
    color: Colors.white,
  },
  info: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  name: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  disabledText: {
    color: Colors.textSecondary,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  shiftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  shiftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: Radius.sm,
  },
  disabledBadge: {
    backgroundColor: Colors.textSecondary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: Radius.sm,
  },
  disabledBadgeText: {
    fontSize: FontSizes.small,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  shiftDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.xs,
  },
  disabledDot: {
    backgroundColor: Colors.textSecondary,
  },
  shiftText: {
    fontSize: FontSizes.small,
    fontWeight: '500',
  },
  disabledShiftText: {
    color: Colors.textSecondary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  paymentButton: {
    marginRight: Spacing.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  dollarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  disabledDollarContainer: {
    backgroundColor: Colors.textSecondary,
  },
  dollarSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  disabledDollarSymbol: {
    color: Colors.white,
  },
  arrowButton: {
    padding: Spacing.xs,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  arrowIcon: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLine: {
    position: 'absolute',
    width: 8,
    height: 1.5,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  arrowLineTop: {
    transform: [{ rotate: '45deg' }, { translateY: -2 }],
  },
  arrowLineBottom: {
    transform: [{ rotate: '-45deg' }, { translateY: 2 }],
  },
});

export default StudentCard;
