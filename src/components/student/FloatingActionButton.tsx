"use client"

import React from "react"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, type ViewStyle } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated"
import { Colors } from "../../theme/theme"

interface FloatingActionButtonProps {
  icon: string
  onPress: () => void
  style?: ViewStyle
  disabled?: boolean
  loading?: boolean
  size?: "small" | "medium" | "large"
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onPress,
  style,
  disabled = false,
  loading = false,
  size = "medium",
}) => {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  React.useEffect(() => {
    opacity.value = withTiming(disabled ? 0.5 : 1, { duration: 200 })
  }, [disabled])

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 })
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { width: 40, height: 40 }
      case "medium":
        return { width: 50, height: 50 }
      case "large":
        return { width: 60, height: 60 }
      default:
        return { width: 50, height: 50 }
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.button, getSizeStyles(), style, animatedStyle]}>
        {loading ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <Text style={[styles.icon, { fontSize: size === "large" ? 24 : 20 }]}>{icon}</Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    color: Colors.white,
    fontWeight: "bold",
  },
})
