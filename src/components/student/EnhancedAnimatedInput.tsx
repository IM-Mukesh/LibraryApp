'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  runOnJS,
  SlideInDown,
  SlideOutUp,
} from 'react-native-reanimated';

// Theme constants
const Colors = {
  primary: '#2E86DE',
  secondary: '#48C9B0',
  background: '#F5F5F5',
  card: '#FFFFFF',
  border: '#E0E0E0',
  textPrimary: '#212121',
  textSecondary: '#757575',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  disabled: '#BDBDBD',
  white: '#FFFFFF',
  black: '#000000',
  neon: '#00F5FF',
  cardGradient: '#1E3A8A',
  surface: '#f2f2f2',
  gray: '#A0A0A0',
};

const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const FontSizes = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

interface FloatingLabelInputProps extends Omit<TextInputProps, 'placeholder'> {
  label: string;
  error?: string;
  containerStyle?: any;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  variant?: 'outlined' | 'filled';
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  error,
  containerStyle,
  required = false,
  helperText,
  value,
  onFocus,
  onBlur,
  disabled = false,
  variant = 'outlined',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef<TextInput>(null);

  // Animation values
  const labelTranslateY = useSharedValue(!!value ? -28 : 0);
  const labelScale = useSharedValue(!!value ? 0.75 : 1);
  const borderColor = useSharedValue(0);
  const backgroundColor = useSharedValue(0);

  // Animation configurations
  const springConfig = useMemo(
    () => ({
      damping: 18,
      stiffness: 250,
      mass: 0.9,
    }),
    [],
  );

  const timingConfig = useMemo(
    () => ({
      duration: 200,
    }),
    [],
  );

  // Handle label animation based on focus and value
  useEffect(() => {
    const shouldFloat = isFocused || hasValue;

    labelTranslateY.value = withSpring(shouldFloat ? -28 : 0, springConfig);
    labelScale.value = withSpring(shouldFloat ? 0.75 : 1, springConfig);
  }, [isFocused, hasValue, springConfig, labelTranslateY, labelScale]);

  // Handle border color and background animations
  useEffect(() => {
    if (disabled) {
      borderColor.value = withTiming(3, timingConfig); // disabled
      backgroundColor.value = withTiming(0.5, timingConfig);
    } else if (error) {
      borderColor.value = withTiming(2, timingConfig); // error
      backgroundColor.value = withTiming(0, timingConfig);
    } else if (isFocused) {
      borderColor.value = withTiming(1, timingConfig); // focused - blue
      backgroundColor.value = withTiming(
        variant === 'filled' ? 0.3 : 0,
        timingConfig,
      );
    } else {
      borderColor.value = withTiming(0, timingConfig); // default - subtle border
      backgroundColor.value = withTiming(
        variant === 'filled' ? 0.1 : 0,
        timingConfig,
      );
    }
  }, [
    isFocused,
    error,
    disabled,
    variant,
    timingConfig,
    borderColor,
    backgroundColor,
  ]);

  // Update hasValue when value changes
  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  // Event handlers
  const handleFocus = useCallback(
    (e: any) => {
      if (disabled) return;
      setIsFocused(true);
      onFocus?.(e);
    },
    [disabled, onFocus],
  );

  const handleBlur = useCallback(
    (e: any) => {
      if (disabled) return;
      setIsFocused(false);
      onBlur?.(e);
    },
    [disabled, onBlur],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      if (disabled) return;

      const newHasValue = !!text;
      if (newHasValue !== hasValue) {
        runOnJS(setHasValue)(newHasValue);
      }
      props.onChangeText?.(text);
    },
    [disabled, hasValue, props],
  );

  // Handle container press to focus input
  const handleContainerPress = useCallback(() => {
    if (disabled || !inputRef.current) return;
    inputRef.current.focus();
  }, [disabled]);

  // Animated styles
  const inputContainerAnimatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        backgroundColor.value,
        [0, 0.1, 0.3, 0.5],
        [Colors.white, Colors.surface, Colors.background, Colors.disabled],
      ),
    }),
    [],
  );

  const borderAnimatedStyle = useAnimatedStyle(
    () => ({
      borderColor: interpolateColor(
        borderColor.value,
        [0, 1, 2, 3],
        ['#D0D0D0', Colors.primary, Colors.error, Colors.disabled], // Subtle gray when unfocused
      ),
    }),
    [],
  );

  // Compute border style based on focus state
  const borderStyle = useMemo(
    () => ({
      borderWidth: isFocused ? 3 : 2, // Thicker border - 3px focused, 2px unfocused
      shadowColor: isFocused ? Colors.primary : '#000000',
      shadowOffset: { width: 0, height: 1 }, // 1px shadow offset
      shadowOpacity: isFocused ? 0.2 : 0.08,
      shadowRadius: isFocused ? 2 : 1, // 1-2px shadow radius
      elevation: isFocused ? 2 : 1, // Android shadow
    }),
    [isFocused],
  );

  const labelAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateY: labelTranslateY.value },
        { scale: labelScale.value },
      ],
      color: interpolateColor(
        borderColor.value,
        [0, 1, 2, 3],
        [Colors.textSecondary, Colors.primary, Colors.error, Colors.disabled],
      ),
    }),
    [],
  );

  // Compute styles
  const inputStyle = useMemo(
    () => [
      styles.input,
      {
        color: disabled ? Colors.disabled : Colors.textPrimary,
      },
      props.multiline && styles.multilineInput,
    ],
    [disabled, props.multiline],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputWrapper}>
        {/* Touchable area for the entire input */}
        <View style={styles.touchableArea} onTouchStart={handleContainerPress}>
          {/* Border */}
          <Animated.View
            style={[styles.border, borderStyle, borderAnimatedStyle]}
          />

          {/* Input Container */}
          <Animated.View
            style={[styles.inputContainer, inputContainerAnimatedStyle]}
          >
            {/* Text Input */}
            <TextInput
              ref={inputRef}
              {...props}
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChangeText={handleChangeText}
              style={inputStyle}
              placeholderTextColor="transparent"
              placeholder=""
              editable={!disabled}
              selectTextOnFocus={!disabled}
            />
          </Animated.View>

          {/* Floating Label - positioned to sit on the border */}
          <Animated.Text
            style={[styles.label, labelAnimatedStyle]}
            onPress={handleContainerPress}
          >
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Animated.Text>
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <Animated.View
          style={styles.messageContainer}
          entering={SlideInDown.duration(200)}
          exiting={SlideOutUp.duration(200)}
        >
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </Animated.View>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <View style={styles.messageContainer}>
          <Text style={styles.helperText}>{helperText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  inputWrapper: {
    position: 'relative',
    minHeight: 56,
  },
  touchableArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderRadius: Radius.md,
    borderColor: '#D0D0D0', // Default subtle gray
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    zIndex: 2,
  },
  label: {
    position: 'absolute',
    left: Spacing.md, // Align with input text - removed the +12
    top: 18,
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    zIndex: 4,
    overflow: 'hidden',
  },
  input: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    minHeight: 24,
    zIndex: 3,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  messageContainer: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  helperText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.small,
  },
  required: {
    color: Colors.error,
    fontWeight: '600',
  },
});

export default FloatingLabelInput;
