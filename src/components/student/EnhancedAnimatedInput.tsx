'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  type TextInputProps,
} from 'react-native';

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
  overlay: 'rgba(0, 0, 0, 0.5)',
  shimmer: 'rgba(255, 255, 255, 0.3)',
  avatarBorder: '#E8F4FD',
  uploadHover: '#1976D2',
};

const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

const FontSizes = {
  xs: 10,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  xxxlarge: 48,
};

const Radius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  full: 9999,
};

const Shadows = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  overlay: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
};

interface FloatingLabelInputProps extends Omit<TextInputProps, 'placeholder'> {
  label: string;
  error?: string;
  containerStyle?: any;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  variant?: 'outlined' | 'filled';
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
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
  showPasswordToggle = false,
  onTogglePassword,
  secureTextEntry = false,
  onChangeText,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Border color animation
    Animated.timing(borderColorAnim, {
      toValue: error ? 2 : disabled ? 3 : isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // Label animation
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, error, disabled]);

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
      onChangeText?.(text);
    },
    [disabled, onChangeText],
  );

  const handleContainerPress = useCallback(() => {
    if (disabled || !inputRef.current) return;
    inputRef.current.focus();
  }, [disabled]);

  // Border color interpolation
  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [Colors.border, Colors.primary, Colors.error, Colors.disabled],
  });

  // Background color for filled variant
  const backgroundColor = borderColorAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      variant === 'filled' ? Colors.surface : Colors.white,
      variant === 'filled' ? Colors.background : Colors.white,
      variant === 'filled' ? Colors.surface : Colors.white,
      Colors.disabled,
    ],
  });

  // Label style with animation
  const labelStyle = {
    position: 'absolute' as const,
    left: Spacing.md,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [FontSizes.medium, FontSizes.small],
    }),
    color: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        error
          ? Colors.error
          : disabled
          ? Colors.disabled
          : Colors.textSecondary,
        error ? Colors.error : disabled ? Colors.disabled : Colors.primary,
      ],
    }),
    backgroundColor: isFocused || value ? Colors.white : 'transparent',
    paddingHorizontal: isFocused || value ? 6 : 0,
    fontWeight: '500' as const,
    zIndex: 1,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputWrapper}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleContainerPress}
          style={styles.touchableArea}
        >
          <Animated.View
            style={[
              styles.inputContainer,
              {
                borderColor,
                backgroundColor,
                borderWidth: isFocused ? 2 : 1,
              },
              isFocused && !error && Shadows.subtle,
            ]}
          >
            <TextInput
              ref={inputRef}
              {...props}
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChangeText={handleChangeText}
              style={[
                styles.textInput,
                {
                  color: disabled ? Colors.disabled : Colors.textPrimary,
                },
                props.multiline && styles.multilineInput,
              ]}
              placeholderTextColor="transparent"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!disabled}
              selectTextOnFocus={!disabled}
              secureTextEntry={secureTextEntry}
              returnKeyType="done"
              blurOnSubmit={false}
            />

            {showPasswordToggle && (
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={onTogglePassword}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Text style={styles.passwordToggleIcon}>
                  {secureTextEntry ? '👁️' : '🙈'}
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          <Animated.Text style={labelStyle} onPress={handleContainerPress}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Animated.Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
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
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    minHeight: 24,
    fontWeight: '500',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  passwordToggle: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginLeft: Spacing.sm,
  },
  passwordToggleIcon: {
    fontSize: 16,
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
