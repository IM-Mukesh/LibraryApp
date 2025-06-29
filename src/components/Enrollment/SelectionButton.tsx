// src/components/SelectionButton.tsx
import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

const { width } = Dimensions.get('window');

interface SelectionButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
  title,
  selected,
  onPress,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.selectionButton,
          selected && styles.selectionButtonSelected,
          { transform: [{ scale: scaleValue }] },
        ]}
      >
        <Text
          style={[
            styles.selectionButtonText,
            selected && styles.selectionButtonTextSelected,
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  selectionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    minWidth: (width - 80) / 3,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  selectionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  selectionButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  selectionButtonTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
});

export default SelectionButton;
