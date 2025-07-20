import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors, Spacing, FontSizes, Radius, Shadows } from '../theme/theme';
import { ProfileHeaderProps } from '../types/ProfileTypes';
import ProfileAvatar from './ProfileAvatar';
import FloatingParticles from './FloatingParticles';

const { height } = Dimensions.get('window');

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  library,
  fadeAnim,
  headerSlideAnim,
  pulseAnim,
  floatAnim,
  rotateAnim,
  scrollY,
}) => {
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          opacity: headerOpacity,
          transform: [{ translateY: headerSlideAnim }, { scale: headerScale }],
        },
      ]}
    >
      <View style={styles.gradientOverlay} />
      <View style={styles.headerContent}>
        <ProfileAvatar
          name={library.adminName}
          pulseAnim={pulseAnim}
          floatAnim={floatAnim}
        />
        <Animated.View
          style={[styles.headerTextContainer, { opacity: fadeAnim }]}
        >
          <Text style={styles.libraryName}>{library.name.toUpperCase()}</Text>
          <Text style={styles.adminName}>
            Administrator: {library.adminName}
          </Text>
        </Animated.View>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PREMIUM</Text>
          </View>
        </View>
      </View>
      <FloatingParticles floatAnim={floatAnim} rotateAnim={rotateAnim} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: height * 0.4,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    opacity: 0.95,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    zIndex: 2,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  libraryName: {
    fontSize: FontSizes.xlarge,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  adminName: {
    fontSize: FontSizes.medium,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: 0.5,
  },
  badgeContainer: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  badge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    ...Shadows.card,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

export default ProfileHeader;
