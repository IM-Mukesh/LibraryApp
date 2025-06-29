import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface ProfileInfoCardProps {
  email: string;
  phone: string;
  address: string;
}

interface InfoItemProps {
  label: string;
  value: string;
  icon: string;
  delay?: number;
}

const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  icon,
  delay = 0,
}) => {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.infoItem,
        {
          opacity: opacityAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </Animated.View>
  );
};

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  email,
  phone,
  address,
}) => {
  const cardScaleAnim = useRef(new Animated.Value(0.95)).current;
  const cardOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardScaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: cardOpacityAnim,
          transform: [{ scale: cardScaleAnim }],
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Contact Information</Text>
      </View>

      <InfoItem label="Email Address" value={email} icon="📧" delay={200} />

      <InfoItem label="Phone Number" value={phone} icon="📱" delay={400} />

      <InfoItem label="Address" value={address} icon="📍" delay={600} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cardTitle: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconText: {
    fontSize: FontSizes.medium,
  },
  infoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSizes.small,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs / 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: FontSizes.medium,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
});

export default ProfileInfoCard;
