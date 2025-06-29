import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

const { width } = Dimensions.get('window');

interface ProfileHeaderProps {
  libraryName: string;
  adminName: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  libraryName,
  adminName,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle pulse animation for the avatar
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    // Subtle rotation for the background gradient
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      }),
    );

    pulseAnimation.start();
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.backgroundGradient,
          {
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
      />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.avatarContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {adminName
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase()}
            </Text>
          </View>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.libraryName}>{libraryName}</Text>
          <Text style={styles.adminName}> {adminName}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGradient: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    backgroundColor: Colors.primary,
    borderRadius: 200,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    zIndex: 1,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: FontSizes.xlarge,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
  },
  textContainer: {
    alignItems: 'center',
  },
  libraryName: {
    fontSize: FontSizes.large,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  adminName: {
    fontSize: FontSizes.medium,
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default ProfileHeader;
