// components/AnimatedInput.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface AnimatedInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  icon?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const borderAnimValue = useRef(new Animated.Value(0)).current;
  const glowAnimValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: isFocused || value ? 1 : 0,
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false, // Changed to false for non-transform properties
      }),
      Animated.timing(borderAnimValue, {
        toValue: isFocused ? 1 : 0,
        duration: 300,
        useNativeDriver: false, // Changed to false for borderColor
      }),
      Animated.timing(glowAnimValue, {
        toValue: isFocused ? 1 : 0,
        duration: 300,
        useNativeDriver: false, // Changed to false for shadowOpacity
      }),
    ]).start();
  }, [isFocused, value, animatedValue, borderAnimValue, glowAnimValue]);

  // Create interpolated values
  const labelTop = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -8],
  });

  const labelFontSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [FontSizes.medium, FontSizes.small],
  });

  const labelColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.textSecondary, Colors.primary],
  });

  const borderColor = borderAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.primary],
  });

  const shadowOpacity = glowAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  const elevation = glowAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  return (
    <View style={styles.inputWrapper}>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor,
            shadowOpacity,
            elevation,
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.label,
            {
              top: labelTop,
              fontSize: labelFontSize,
              color: labelColor,
            },
          ]}
        >
          {placeholder}
        </Animated.Text>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          selectionColor={Colors.primary}
        />
        {icon && <Text style={styles.inputIcon}>{icon}</Text>}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  label: {
    position: 'absolute',
    left: Spacing.md,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.xs,
    zIndex: 1,
  },
  textInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    paddingRight: 50,
  },
  inputIcon: {
    position: 'absolute',
    right: Spacing.md,
    top: '50%',
    marginTop: -12,
    fontSize: 20,
  },
});

export default AnimatedInput;
