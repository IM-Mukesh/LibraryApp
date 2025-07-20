import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors, Spacing, FontSizes, Radius, Shadows } from '../theme/theme';
import { ProfileInfoCardProps } from '../types/ProfileTypes';
import InfoRow from './InfoRow';

const { width } = Dimensions.get('window');

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  library,
  fadeAnim,
  cardSlideAnim,
  shimmerAnim,
}) => {
  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <Animated.View
      style={[
        styles.infoCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: cardSlideAnim }],
        },
      ]}
    >
      <View style={styles.shimmerContainer}>
        <Animated.View
          style={[
            styles.shimmerEffect,
            { transform: [{ translateX: shimmerTranslate }] },
          ]}
        />
      </View>
      <Text style={styles.cardTitle}>Contact Information</Text>
      <InfoRow icon="📧" label="Email Address" value={library.adminEmail} />
      <InfoRow icon="📱" label="Phone Number" value={library.adminPhone} />
      <InfoRow
        icon="📍"
        label="Library Address"
        value={library.address}
        isLast={true}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xl * 1.25,
    borderRadius: Radius.xxl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    ...Shadows.card,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 20,
    zIndex: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    overflow: 'hidden',
  },
  shimmerEffect: {
    width: 100,
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 0.6,
  },
  cardTitle: {
    fontSize: FontSizes.large,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default ProfileInfoCard;
