// src/components/AnimatedInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface AnimatedInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?:
    | 'default'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'number-pad';
  required?: boolean;
  multiline?: boolean;
  editable?: boolean;
  onPress?: () => void;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  required = false,
  multiline = false,
  editable = true,
  onPress,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value || !editable ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, editable]);

  const handleFocus = () => {
    if (!editable) return;
    setIsFocused(true);
    Animated.spring(scaleValue, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const labelStyle = {
    position: 'absolute' as const,
    left: 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [multiline ? 24 : 18, -10],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        Colors.textSecondary,
        !editable
          ? Colors.textPrimary
          : isFocused
          ? Colors.primary
          : Colors.textPrimary,
      ],
    }),
    backgroundColor: Colors.white,
    paddingHorizontal: 4,
    zIndex: 1,
  };

  const InputComponent = (
    <TextInput
      style={[
        styles.input,
        multiline && styles.multilineInput,
        isFocused && styles.inputFocused,
        !editable && styles.inputDisabled,
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={isFocused || value || !editable ? '' : placeholder}
      placeholderTextColor={Colors.textSecondary}
      onFocus={handleFocus}
      onBlur={handleBlur}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      editable={editable}
    />
  );

  return (
    <Animated.View
      style={[styles.inputContainer, { transform: [{ scale: scaleValue }] }]}
    >
      <Animated.Text style={labelStyle}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Animated.Text>
      {onPress && !editable ? (
        <TouchableOpacity onPress={handlePress}>
          {InputComponent}
        </TouchableOpacity>
      ) : (
        InputComponent
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md + 2,
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
    minHeight: 50,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: Spacing.md + 4,
  },
  inputFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  inputDisabled: {
    backgroundColor: Colors.background,
    color: Colors.textSecondary,
  },
  required: {
    color: Colors.error,
  },
});

export default AnimatedInput;
