'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface PickerOption {
  label: string;
  value: string;
}

interface EnhancedAnimatedPickerProps {
  label: string;
  value: string;
  options: PickerOption[];
  onSelect: (value: string) => void;
  error?: string;
  icon?: string;
  containerStyle?: any;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}

export const EnhancedAnimatedPicker: React.FC<EnhancedAnimatedPickerProps> = ({
  label,
  value,
  options,
  onSelect,
  error,
  icon,
  containerStyle,
  required = false,
  placeholder = '',
  helperText,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  // Enhanced animations
  const labelPosition = useSharedValue(value ? 1 : 0);
  const labelScale = useSharedValue(value ? 1 : 0);
  const borderColor = useSharedValue(0);
  const containerScale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);
  const modalOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);

  useEffect(() => {
    const shouldFloat = isFocused || hasValue;

    labelPosition.value = withSpring(shouldFloat ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });

    labelScale.value = withSpring(shouldFloat ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [isFocused, hasValue]);

  useEffect(() => {
    borderColor.value = withTiming(error ? 2 : isFocused ? 1 : 0, {
      duration: 200,
    });

    shadowOpacity.value = withTiming(isFocused ? 0.3 : 0.1, {
      duration: 200,
    });
  }, [isFocused, error]);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const openModal = () => {
    setIsModalVisible(true);
    setIsFocused(true);
    containerScale.value = withSpring(1.02, { damping: 15, stiffness: 200 });

    modalOpacity.value = withTiming(1, { duration: 200 });
    modalScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const closeModal = () => {
    modalOpacity.value = withTiming(0, { duration: 150 });
    modalScale.value = withSpring(0.8, { damping: 15, stiffness: 200 });

    setTimeout(() => {
      setIsModalVisible(false);
      setIsFocused(false);
      containerScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }, 150);
  };

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    setHasValue(true);
    closeModal();
  };

  const getSelectedLabel = () => {
    const selectedOption = options.find(option => option.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const labelStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: icon ? 48 : 16,
    top: labelPosition.value === 1 ? 8 : 20,
    fontSize: labelScale.value === 1 ? FontSizes.small : FontSizes.medium,
    color: interpolateColor(
      borderColor.value,
      [0, 1, 2],
      [Colors.textSecondary, Colors.primary, Colors.error],
    ),
    backgroundColor: Colors.white,
    paddingHorizontal: 4,
    zIndex: 2,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    shadowOpacity: shadowOpacity.value,
    borderColor: interpolateColor(
      borderColor.value,
      [0, 1, 2],
      [Colors.border, Colors.primary, Colors.error],
    ),
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));

  const renderOption = ({ item }: { item: PickerOption }) => (
    <TouchableOpacity
      style={[styles.option, item.value === value && styles.selectedOption]}
      onPress={() => handleSelect(item.value)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.optionText,
          item.value === value && styles.selectedOptionText,
        ]}
      >
        {item.label}
      </Text>
      {item.value === value && <Text style={styles.checkMark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity onPress={openModal} activeOpacity={0.8}>
        <Animated.View style={[styles.inputContainer, containerAnimatedStyle]}>
          {icon && (
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
          )}

          <View style={[styles.input, { paddingLeft: icon ? 48 : 16 }]}>
            <Text style={[styles.inputText, !value && styles.placeholderText]}>
              {getSelectedLabel()}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </View>

          <Animated.Text style={labelStyle}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>

      {error && (
        <Animated.View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </Animated.View>
      )}

      {helperText && !error && (
        <View style={styles.helperContainer}>
          <Text style={styles.helperText}>💡 {helperText}</Text>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={renderOption}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              bounces={false}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    minHeight: 56,
    justifyContent: 'center',
    position: 'relative',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingTop: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  inputText: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    flex: 1,
    marginLeft: 4,
  },
  placeholderText: {
    color: Colors.textSecondary,
  },
  dropdownIcon: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  iconContainer: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  icon: {
    fontSize: 20,
  },
  errorContainer: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.small,
    fontWeight: '500',
  },
  helperContainer: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  helperText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.small,
  },
  required: {
    color: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    maxHeight: screenHeight * 0.6,
    width: '100%',
    maxWidth: 400,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.primary,
    flex: 1,
  },
  closeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.md,
  },
  closeButtonText: {
    fontSize: FontSizes.large,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  optionsList: {
    maxHeight: screenHeight * 0.4,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  selectedOption: {
    backgroundColor: Colors.primary + '10',
  },
  optionText: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    flex: 1,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkMark: {
    fontSize: FontSizes.medium,
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: Spacing.sm,
  },
});
