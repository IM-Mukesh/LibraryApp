import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface LibraryData {
  name: string;
  code: string;
  status: string; // Changed from 'active' | 'inactive' to string to match Redux state
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  address: string;
}

interface LibraryProfileCardProps {
  library: LibraryData;
  delay?: number;
}

const { width } = Dimensions.get('window');

const LibraryProfileCard: React.FC<LibraryProfileCardProps> = ({
  library,
  delay = 0,
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();

    // Continuous glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [delay]);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(46, 134, 222, 0.1)', 'rgba(46, 134, 222, 0.3)'],
  });

  const ProfileRow = ({
    label,
    value,
    isStatus = false,
  }: {
    label: string;
    value: string;
    isStatus?: boolean;
  }) => (
    <View style={styles.profileRow}>
      <Text style={styles.label}>{label}</Text>
      {isStatus ? (
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                value.toLowerCase() === 'active'
                  ? Colors.success
                  : Colors.error,
              shadowColor:
                value.toLowerCase() === 'active'
                  ? Colors.success
                  : Colors.error,
            },
          ]}
        >
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{value.toUpperCase()}</Text>
        </View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <Animated.View style={[styles.glowContainer, { shadowColor: glowColor }]}>
        <View style={styles.card}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Library Profile</Text>
              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>ID</Text>
                <Text style={styles.codeValue}>{library.code}</Text>
              </View>
            </View>
            <View style={styles.headerGradient} />
          </View>

          {/* Profile Information */}
          <View style={styles.content}>
            <ProfileRow label="Library Name" value={library.name} />
            <ProfileRow label="Administrator" value={library.adminName} />
            <ProfileRow label="Email Address" value={library.adminEmail} />
            <ProfileRow label="Phone Number" value={library.adminPhone} />
            <ProfileRow label="Address" value={library.address} />
            <ProfileRow label="Status" value={library.status} isStatus />
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  glowContainer: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(46, 134, 222, 0.1)',
  },
  header: {
    position: 'relative',
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: `${Colors.primary}15`,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
  },
  title: {
    fontSize: FontSizes.xlarge,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  codeContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  codeLabel: {
    fontSize: FontSizes.small - 2,
    color: Colors.white,
    opacity: 0.8,
    fontWeight: '500',
  },
  codeValue: {
    fontSize: FontSizes.medium,
    color: Colors.white,
    fontWeight: '700',
    letterSpacing: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}40`,
  },
  label: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1.5,
    textAlign: 'right',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
  },
  statusText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${Colors.secondary}10`,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${Colors.neon}15`,
  },
});

export default LibraryProfileCard;
