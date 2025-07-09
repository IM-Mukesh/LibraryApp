import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
import DueFeesTab from './DueFeesTab';
import PaidFeesTab from './PaidFeesTab';

const { width } = Dimensions.get('window');

interface ManagementContainerProps {
  refreshing: boolean;
}

const FeeManagementContainer: React.FC<ManagementContainerProps> = ({
  refreshing,
}) => {
  const [activeTab, setActiveTab] = useState<'due' | 'paid'>('due');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

  const handleTabChange = (tab: 'due' | 'paid') => {
    if (activeTab === tab) return; // Prevent unnecessary animations

    setActiveTab(tab);

    // Animate content sliding
    Animated.timing(slideAnim, {
      toValue: tab === 'due' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Animate tab indicator
    Animated.timing(tabIndicatorAnim, {
      toValue: tab === 'due' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
    extrapolate: 'clamp',
  });

  const tabIndicatorTranslateX = tabIndicatorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, (width - Spacing.lg * 2 - 8) / 2 + 4], // Properly center on second tab
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Tab Header */}
      <View style={styles.tabHeader}>
        <View style={styles.tabContainer}>
          {/* Animated Tab Indicator */}
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                transform: [{ translateX: tabIndicatorTranslateX }],
              },
            ]}
          />

          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabChange('due')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'due' && styles.activeTabText,
              ]}
            >
              Due
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabChange('paid')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'paid' && styles.activeTabText,
              ]}
            >
              Paid
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content with Animation */}
      <View style={styles.contentWrapper}>
        <Animated.View
          style={[
            styles.animatedContent,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={styles.tabPanel}>
            <DueFeesTab />
          </View>
          <View style={styles.tabPanel}>
            <PaidFeesTab />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 50,
    padding: 4,
    height: 48,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 0,
    width: (width - Spacing.lg * 2 - 8) / 2, // Half width minus padding and margins
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginHorizontal: 2,
    zIndex: 1,
  },
  tabText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: '700',
  },
  contentWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  animatedContent: {
    flexDirection: 'row',
    flex: 1,
    width: width * 2,
  },
  tabPanel: {
    width: width,
    flex: 1,
  },
});

export default FeeManagementContainer;
