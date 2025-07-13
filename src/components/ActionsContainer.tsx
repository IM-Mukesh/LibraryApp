import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes } from '../theme/theme';
import { ActionsContainerProps } from '../types/ProfileTypes';
import ActionButton from './ActionButton';

const ActionsContainer: React.FC<ActionsContainerProps> = ({
  fadeAnim,
  buttonScaleAnim,
  onChangePassword,
  onSupport,
}) => {
  return (
    <Animated.View
      style={[
        styles.actionsContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: buttonScaleAnim }],
        },
      ]}
    >
      <Text style={styles.sectionTitle}>Account Management</Text>
      <ActionButton
        icon="🔐"
        title="Change Password"
        subtitle="Update your security credentials"
        onPress={onChangePassword}
        disabled={false}
      />
      <ActionButton
        icon="🎧"
        title="Help & Support"
        subtitle="Get assistance from our team"
        onPress={onSupport}
        disabled={true}
        showComingSoon={true}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    letterSpacing: 0.5,
  },
});

export default ActionsContainer;
