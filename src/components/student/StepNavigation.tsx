import type React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
  loading: boolean;
}

const FloatingButton: React.FC<{
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  type: 'previous' | 'next';
  style?: any;
}> = ({ onPress, disabled = false, loading = false, type, style }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 1, // Always fully opaque
  }));

  const isPrevious = type === 'previous';
  const buttonStyle = isPrevious ? styles.previousButton : styles.nextButton;
  const icon = isPrevious ? '‹' : '›';

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        style={[buttonStyle, style]}
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {loading ? (
          <Text style={styles.loadingText}>...</Text>
        ) : (
          <Text style={[styles.buttonIcon, isPrevious && styles.previousIcon]}>
            {icon}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canProceed,
  loading,
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <View style={styles.container}>
      <View style={styles.leftButton}>
        {!isFirstStep && (
          <FloatingButton
            type="previous"
            onPress={onPrevious}
            disabled={loading}
          />
        )}
      </View>

      <View style={styles.rightButton}>
        {!isLastStep && (
          <FloatingButton
            type="next"
            onPress={onNext}
            disabled={!canProceed || loading}
            loading={loading}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    left: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 10,
  },
  leftButton: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  previousButton: {
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: Spacing.xs },
    shadowOpacity: 0.3,
    shadowRadius: Spacing.xs + 2,
    elevation: 8,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: Spacing.xs },
    shadowOpacity: 0.3,
    shadowRadius: Spacing.xs + 2,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: Colors.disabled,
  },
  submitButton: {
    backgroundColor: Colors.success,
  },
  buttonIcon: {
    fontSize: FontSizes.xlarge,
    color: Colors.white,
    fontWeight: 'bold',
  },
  previousIcon: {
    fontSize: FontSizes.xlarge,
  },
  loadingText: {
    fontSize: FontSizes.large,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
