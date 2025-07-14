// components/HeaderCard.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../theme/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface HeaderCardProps {
  onProfilePress: () => void;
}

const HeaderCard: React.FC<HeaderCardProps> = ({ onProfilePress }) => {
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
    return libraryData?.status === 'active' ? 'Active' : 'Blocked';
  };

  const handleProfilePress = () => {
    onProfilePress();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
      ]}
    >
      <View style={styles.row}>
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.iconWrapper}
          activeOpacity={0.8}
        >
          <Image
            source={{
              uri: libraryData?.profileImage
                ? libraryData?.profileImage
                : 'https://static.vecteezy.com/system/resources/thumbnails/011/490/381/small_2x/happy-smiling-young-man-avatar-3d-portrait-of-a-man-cartoon-character-people-illustration-isolated-on-white-background-vector.jpg',
            }}
            style={styles.icon}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.libraryName} numberOfLines={1}>
              {libraryData?.name?.toUpperCase()}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() },
              ]}
            >
              <Text style={styles.statusText}>{getStatus()}</Text>
            </View>
          </View>
          <Text style={styles.adminName} numberOfLines={1}>
            {libraryData?.adminName.toUpperCase()}
          </Text>
        </View>
      </View>
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: Spacing.md,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
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
    marginLeft: Spacing.sm,
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
  },
});

export default HeaderCard;
