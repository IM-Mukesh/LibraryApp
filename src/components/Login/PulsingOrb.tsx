// components/PulsingOrb.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface PulsingOrbProps {
  size: number;
  color: string;
  duration: number;
  style?: any;
}

const PulsingOrb: React.FC<PulsingOrbProps> = ({
  size,
  color,
  duration,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.2,
            duration: duration,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => pulse());
    };

    pulse();
  }, [duration, scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          position: 'absolute',
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

export default PulsingOrb;
