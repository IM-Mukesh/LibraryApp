import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius, Shadows } from '../theme/theme';

const { width } = Dimensions.get('window');

const LoadingScreen: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
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
    ).start();

    // Rotate animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      }),
    ).start();

    // Shimmer animation
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.loadingContainer}>
        <Animated.View
          style={[styles.loadingCard, { transform: [{ scale: pulseAnim }] }]}
        >
          <View style={styles.loadingIconContainer}>
            <Animated.View
              style={[
                styles.loadingIcon,
                { transform: [{ rotate: rotateInterpolate }] },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Loading Your Profile</Text>
          <View style={styles.loadingBarContainer}>
            <Animated.View
              style={[
                styles.loadingBar,
                { transform: [{ translateX: shimmerTranslate }] },
              ]}
            />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  loadingCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    ...Shadows.card,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
    minWidth: width * 0.7,
  },
  loadingIconContainer: {
    marginBottom: Spacing.lg,
  },
  loadingIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: Colors.primary,
    borderTopColor: Colors.secondary,
  },
  loadingText: {
    fontSize: FontSizes.large,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    letterSpacing: 0.5,
  },
  loadingBarContainer: {
    width: 200,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  loadingBar: {
    width: 80,
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
  },
});

export default LoadingScreen;
