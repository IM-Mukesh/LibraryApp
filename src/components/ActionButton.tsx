import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSizes, Radius, Shadows } from '../theme/theme';
import { ActionButtonProps } from '../types/ProfileTypes';

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  disabled = false,
  showComingSoon = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.actionButton, disabled && styles.disabledButton]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={styles.buttonContent}>
        <View style={styles.buttonIcon}>
          <Text style={styles.buttonIconText}>{icon}</Text>
        </View>
        <View style={styles.buttonTextContainer}>
          <Text style={[styles.buttonTitle, disabled && styles.disabledText]}>
            {title}
          </Text>
          <Text
            style={[styles.buttonSubtitle, disabled && styles.disabledText]}
          >
            {subtitle}
          </Text>
        </View>
        <View style={styles.buttonArrow}>
          <Text style={[styles.arrowText, disabled && styles.disabledText]}>
            ›
          </Text>
        </View>
      </View>
      {showComingSoon && (
        <View style={styles.disabledOverlay}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    ...Shadows.card,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  buttonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.subtle,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIconText: {
    fontSize: FontSizes.large * 1.2,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: FontSizes.medium,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs / 2,
    letterSpacing: 0.3,
  },
  buttonSubtitle: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  buttonArrow: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: FontSizes.xlarge,
    color: Colors.primary,
    fontWeight: '300',
  },
  disabledText: {
    color: Colors.disabled,
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderTopLeftRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
  },
  comingSoonText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ActionButton;
