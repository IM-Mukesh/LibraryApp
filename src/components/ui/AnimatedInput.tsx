// src/components/ui/AnimatedInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface AnimatedInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  containerStyle?: any;
  required?: boolean;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  icon,
  containerStyle,
  required = false,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  // Separate animations for different properties
  const labelPositionAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const labelScaleAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shouldFloat = isFocused || hasValue;

    Animated.parallel([
      Animated.timing(labelPositionAnim, {
        toValue: shouldFloat ? 1 : 0,
        duration: 200,
        useNativeDriver: false, // Position animations need this to be false
      }),
      Animated.timing(labelScaleAnim, {
        toValue: shouldFloat ? 1 : 0,
        duration: 200,
        useNativeDriver: false, // Scale animations need this to be false
      }),
    ]).start();
  }, [isFocused, hasValue]);

  useEffect(() => {
    Animated.timing(borderColorAnim, {
      toValue: error ? 2 : isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // Color animations need this to be false
    }).start();
  }, [isFocused, error]);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const labelStyle = {
    position: 'absolute' as const,
    left: icon ? 48 : 16,
    top: labelPositionAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 8],
    }),
    fontSize: labelScaleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [FontSizes.medium, FontSizes.small],
    }),
    color: borderColorAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [Colors.textSecondary, Colors.primary, Colors.error],
    }),
    backgroundColor: Colors.white,
    paddingHorizontal: 4,
    zIndex: 2,
  };

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [Colors.border, Colors.primary, Colors.error],
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    setHasValue(!!text);
    props.onChangeText?.(text);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <TextInput
          {...props}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          style={[
            styles.input,
            { paddingLeft: icon ? 48 : 16 },
            props.multiline && styles.multilineInput,
          ]}
          placeholderTextColor={Colors.textSecondary}
          placeholder={isFocused || hasValue ? '' : ''}
        />

        <Animated.Text style={labelStyle}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Animated.Text>
      </Animated.View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    minHeight: 56,
    justifyContent: 'center',
    position: 'relative',
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    zIndex: 1,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 24,
  },
  iconContainer: {
    position: 'absolute',
    left: 16,
    top: 20,
    zIndex: 1,
  },
  errorContainer: {
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.small,
  },
  required: {
    color: Colors.error,
  },
});
