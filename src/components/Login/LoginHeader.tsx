// components/LoginHeader.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '../../theme/theme';

const LoginHeader: React.FC = () => {
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateLogo = () => {
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        logoRotateAnim.setValue(0);
        rotateLogo();
      });
    };

    rotateLogo();
  }, [logoRotateAnim]);

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.header}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ rotate: logoRotation }],
          },
        ]}
      >
        <View style={styles.logoRing} />
        <View style={styles.logoCore} />
      </Animated.View>

      <Text style={styles.title}>DIGITAL LIBRARY</Text>
      <Text style={styles.subtitle}>Access Portal</Text>
      <View style={styles.titleUnderline} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl * 2,
  },
  logoContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  logoCore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: FontSizes.xlarge + 4,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    letterSpacing: 1,
  },
  titleUnderline: {
    width: 60,
    height: 2,
    backgroundColor: Colors.primary,
    marginTop: Spacing.sm,
  },
});

export default LoginHeader;
