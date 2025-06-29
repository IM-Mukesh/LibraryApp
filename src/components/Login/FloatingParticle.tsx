// components/FloatingParticle.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Dimensions, StyleSheet } from 'react-native';
import { Colors } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

interface ParticleProps {
  delay: number;
}

const FloatingParticle: React.FC<ParticleProps> = ({ delay }) => {
  const translateY = useRef(new Animated.Value(height + 50)).current;
  const translateX = useRef(new Animated.Value(Math.random() * width)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -50,
            duration: 8000 + Math.random() * 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        translateY.setValue(height + 50);
        translateX.setValue(Math.random() * width);
        opacity.setValue(0);
        scale.setValue(0);
        animate();
      });
    };

    animate();
  }, [delay, translateY, translateX, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [{ translateX }, { translateY }, { scale }],
          opacity,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  particle: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.primary,
    position: 'absolute',
  },
});

export default FloatingParticle;
