// src/components/StudentCard.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface Student {
  _id: string;
  name: string;
  mobile: string;
  aadhar: string;
  shift: string;
  avatar?: string;
}

interface StudentCardProps {
  student: Student;
  onPaymentPress: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onPaymentPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dollarScaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  const getShiftColor = (shift: string): string => {
    switch (shift.toLowerCase()) {
      case 'morning':
      case 'First':
      case 'first':
        return Colors.success;
      case 'afternoon':
      case 'Second':
      case 'second':
        return Colors.warning;
      case 'evening':
      case 'third':
      case 'Third':
        return Colors.primary;
      default:
        return Colors.textSecondary;
    }
  };

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleDollarPressIn = () => {
    Animated.sequence([
      Animated.timing(dollarScaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(dollarScaleAnim, {
        toValue: 1.2,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDollarPressOut = () => {
    Animated.spring(dollarScaleAnim, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.primary],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.3],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: borderColor,
          shadowOpacity: shadowOpacity,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      id={student._id}
    >
      <View style={styles.content}>
        {/* Avatar and Main Info */}
        <View style={styles.leftSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitial(student.name)}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {student.name}
            </Text>
            <View style={styles.shiftContainer}>
              <View
                style={[
                  styles.shiftBadge,
                  { backgroundColor: getShiftColor(student.shift) + '20' },
                ]}
              >
                <View
                  style={[
                    styles.shiftDot,
                    { backgroundColor: getShiftColor(student.shift) },
                  ]}
                />
                <Text
                  style={[
                    styles.shiftText,
                    { color: getShiftColor(student.shift) },
                  ]}
                >
                  {student.shift}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Button */}
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={onPaymentPress}
          onPressIn={handleDollarPressIn}
          onPressOut={handleDollarPressOut}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.dollarContainer,
              {
                transform: [{ scale: dollarScaleAnim }],
              },
            ]}
          >
            <Text style={styles.dollarSymbol}>$</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Animated.View>
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: FontSizes.large,
    fontWeight: '700',
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
  shiftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: Radius.sm,
  },
  shiftDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.xs,
  },
  shiftText: {
    fontSize: FontSizes.small,
    fontWeight: '500',
  },
  paymentButton: {
    marginLeft: Spacing.md,
  },
  dollarContainer: {
    width: 36,
    height: 36,
    borderRadius: 50,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  dollarSymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
  },
});

export default StudentCard;
