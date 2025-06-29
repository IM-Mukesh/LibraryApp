// components/HeaderCard.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../theme/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface HeaderCardProps {
  // libraryName: string;
  // adminName: string;
  // adminEmail: string;
  // status: 'active' | 'blocked';
}

const HeaderCard: React.FC<HeaderCardProps> = (
  {
    // libraryName,
    // adminName,
    // adminEmail,
    // status,
  },
) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const libraryData = useSelector((state: RootState) => state?.auth?.library);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getStatusColor = () => {
    return libraryData?.status === 'active' ? Colors.success : Colors.error;
  };

  const getStatus = () => {
    if (libraryData?.status === 'active') {
      return 'Active';
    }
    return 'Blocked';
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.libraryName}>
          {libraryData?.name.toUpperCase()}
        </Text>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
        >
          <Text style={styles.statusText}>{getStatus()}</Text>
        </View>
      </View>
      <Text style={styles.adminName}>{libraryData?.adminName}</Text>
      {/* <Text style={styles.adminEmail}>{adminEmail}</Text> */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  libraryName: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.lg,
  },
  statusText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  adminName: {
    fontSize: FontSizes.small,
    fontWeight: '500',
    letterSpacing: 2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  adminEmail: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
  },
});

export default HeaderCard;
