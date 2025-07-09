'use client';
import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, Spacing, FontSizes } from '../../theme/theme';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepPress: (step: number) => void;
}

// Memoized StepDot component to prevent unnecessary re-renders
const StepDot: React.FC<{
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  onPress: (step: number) => void;
  label: string;
  currentStep: number;
}> = memo(({ step, isActive, isCompleted, onPress, label, currentStep }) => {
  const scale = useSharedValue(isActive ? 1.1 : 1);
  const opacity = useSharedValue(isActive || isCompleted ? 1 : 0.5);

  React.useEffect(() => {
    scale.value = withSpring(isActive ? 1.1 : 1, {
      damping: 15,
      stiffness: 200,
    });
    opacity.value = withTiming(isActive || isCompleted ? 1 : 0.5, {
      duration: 300,
    });
  }, [isActive, isCompleted, scale, opacity]);

  const dotStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      backgroundColor: isActive
        ? Colors.primary
        : isCompleted
        ? Colors.success
        : Colors.border,
    }),
    [isActive, isCompleted],
  );

  const textStyle = useAnimatedStyle(
    () => ({
      color: isActive || isCompleted ? Colors.white : Colors.textSecondary,
    }),
    [isActive, isCompleted],
  );

  const handlePress = useCallback(() => {
    onPress(step);
  }, [onPress, step]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.stepContainer}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.stepDot, dotStyle]}>
        <Animated.Text style={[styles.stepText, textStyle]}>
          {isCompleted && step < currentStep ? '✓' : step + 1}
        </Animated.Text>
      </Animated.View>
      <Text style={styles.stepLabel}>{label}</Text>
    </TouchableOpacity>
  );
});

StepDot.displayName = 'StepDot';

export const StepIndicator: React.FC<StepIndicatorProps> = memo(
  ({ currentStep, totalSteps, onStepPress }) => {
    // Memoize steps array to prevent recreation on every render
    const steps = useMemo(
      () => Array.from({ length: totalSteps }, (_, index) => index),
      [totalSteps],
    );

    // Memoize step labels to prevent recreation
    const stepLabels = useMemo(() => {
      const labels = ['Personal', 'Contact', 'Academic', 'Review'];
      return steps.map(step => labels[step] || `Step ${step + 1}`);
    }, [steps]);

    // Memoize connector style to prevent recreation
    const connectorStyle = useMemo(
      () => ({
        ...styles.connector,
        backgroundColor: Colors.border,
      }),
      [],
    );

    return (
      <View style={styles.container}>
        <View style={styles.indicatorContainer}>
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <StepDot
                step={step}
                isActive={step === currentStep}
                isCompleted={step < currentStep}
                onPress={onStepPress}
                label={stepLabels[step]}
                currentStep={currentStep}
              />
              {step < totalSteps - 1 && <View style={connectorStyle} />}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  },
);

StepIndicator.displayName = 'StepIndicator';

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    // paddingHorizontal: 24, // Added 24px horizontal padding as requested
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    minWidth: 60,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  stepText: {
    fontSize: FontSizes.small,
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  connector: {
    width: 16,
    height: 2,
    marginHorizontal: Spacing.xs,
    marginBottom: 20,
    borderRadius: 2,
  },
});
