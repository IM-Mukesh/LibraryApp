// components/FeeManagement/TabHeader.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface TabHeaderProps {
  activeTab: 'due' | 'paid';
  onTabChange: (tab: 'due' | 'paid') => void;
}

const { width } = Dimensions.get('window');

const TabHeader: React.FC<TabHeaderProps> = ({ activeTab, onTabChange }) => {
  const slideAnim = useRef(
    new Animated.Value(activeTab === 'due' ? 0 : 1),
  ).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeTab === 'due' ? 0 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [activeTab]);

  const handleTabPress = (tab: 'due' | 'paid') => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onTabChange(tab);
  };

  const indicatorWidth = (width - Spacing.lg * 2 - Spacing.sm) / 2;

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'due' && styles.activeTab]}
          onPress={() => handleTabPress('due')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'due' && styles.activeTabText,
            ]}
          >
            📋 Due Fees
            {/* Due Fees */}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'paid' && styles.activeTab]}
          onPress={() => handleTabPress('paid')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'paid' && styles.activeTabText,
            ]}
          >
            {/* Paid Fees */}✅ Paid Fees
          </Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.indicator,
            {
              width: indicatorWidth,
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, indicatorWidth + Spacing.sm],
                  }),
                },
                { scale: scaleAnim },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    padding: Spacing.xs,
    position: 'relative',
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    zIndex: 2,
  },
  activeTab: {
    // Active styles handled by indicator
  },
  tabText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
  },
  indicator: {
    position: 'absolute',
    top: Spacing.xs,
    left: Spacing.xs,
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default TabHeader;
