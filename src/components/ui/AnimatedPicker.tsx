// src/components/ui/AnimatedPicker.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface PickerOption {
  label: string;
  value: string;
}

interface AnimatedPickerProps {
  label: string;
  value: string;
  options: PickerOption[];
  onSelect: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
  containerStyle?: any;
  required?: boolean;
  placeholder?: string;
}

export const AnimatedPicker: React.FC<AnimatedPickerProps> = ({
  label,
  value,
  options,
  onSelect,
  error,
  icon,
  containerStyle,
  required = false,
  placeholder = '',
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  // Separate animations for different properties
  const labelPositionAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const labelScaleAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const shouldFloat = isFocused || hasValue;

    Animated.parallel([
      Animated.timing(labelPositionAnim, {
        toValue: shouldFloat ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(labelScaleAnim, {
        toValue: shouldFloat ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFocused, hasValue]);

  useEffect(() => {
    Animated.timing(borderColorAnim, {
      toValue: error ? 2 : isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, error]);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const openModal = () => {
    setIsModalVisible(true);
    setIsFocused(true);

    Animated.parallel([
      Animated.timing(modalOpacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalOpacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(modalScaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsModalVisible(false);
      setIsFocused(false);
    });
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
        <Animated.View style={[styles.inputContainer, { borderColor }]}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}

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
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
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
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: modalOpacityAnim,
                transform: [{ scale: modalScaleAnim }],
              },
            ]}
          >
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  inputText: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    maxHeight: screenHeight * 0.6,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
