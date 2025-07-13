import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { FloatingParticlesProps } from '../types/ProfileTypes';

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  floatAnim,
  rotateAnim,
}) => {
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.particlesContainer}>
      {[...Array(6)].map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              transform: [
                {
                  translateY: floatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -15 - i * 3],
                  }),
                },
                { rotate: rotateInterpolate },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});

export default FloatingParticles;
