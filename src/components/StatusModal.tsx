import type React from 'react';
import { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, Radius } from '../theme/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StatusModalProps {
  visible: boolean;
  type: 'success' | 'error' | null;
  onClose: () => void;
  successTitle?: string;
  successMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  type,
  onClose,
  successTitle = 'Success!',
  successMessage = 'Operation completed successfully.',
  errorTitle = 'Error!',
  errorMessage = 'Something went wrong. Please try again.',
  autoClose = true,
  autoCloseDelay = 3000,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const checkmarkPath = useSharedValue(0);

  useEffect(() => {
    if (visible && type) {
      // Animate modal appearance
      opacity.value = withSpring(1, { damping: 15, stiffness: 200 });
      scale.value = withSequence(
        withSpring(1.1, { damping: 15, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 200 }),
      );

      // Animate icon with delay
      iconScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.3, { damping: 15, stiffness: 200 }),
          withSpring(1, { damping: 15, stiffness: 200 }),
        ),
      );

      // Animate checkmark path for success
      if (type === 'success') {
        checkmarkPath.value = withDelay(
          400,
          withSpring(1, { damping: 15, stiffness: 200 }),
        );
      }

      // Auto close
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      opacity.value = 0;
      scale.value = 0;
      iconScale.value = 0;
      checkmarkPath.value = 0;
    }
  }, [visible, type]);

  const handleClose = () => {
    opacity.value = withSpring(0, { damping: 15, stiffness: 200 });
    scale.value = withSpring(0, { damping: 15, stiffness: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  if (!visible || !type) return null;

  const isSuccess = type === 'success';
  const iconColor = isSuccess ? Colors.success : Colors.error;
  const title = isSuccess ? successTitle : errorTitle;
  const message = isSuccess ? successMessage : errorMessage;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <Animated.View
            style={[styles.overlayBackground, overlayAnimatedStyle]}
          />
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modal, modalAnimatedStyle]}>
              <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
                <View
                  style={[styles.iconCircle, { backgroundColor: iconColor }]}
                >
                  {isSuccess ? (
                    <View style={styles.checkmarkContainer}>
                      <Text style={styles.checkmarkIcon}>✓</Text>
                    </View>
                  ) : (
                    <View style={styles.crossContainer}>
                      <Text style={styles.crossIcon}>✕</Text>
                    </View>
                  )}
                </View>
              </Animated.View>

              <Text style={[styles.title, { color: iconColor }]}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: iconColor }]}
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>OK</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.black,
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
    maxWidth: SCREEN_WIDTH * 0.85,
    minWidth: SCREEN_WIDTH * 0.7,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: 'bold',
  },
  crossContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossIcon: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: 'bold',
  },
  title: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  closeButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
});
