import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
import {
  dueStudents,
  paidStudents,
} from '../../components/FeeManagement/fakeData';
import DueFeesTab from './DueFeesTab';
import PaidFeesTab from './PaidFeesTab';

interface Student {
  name: string;
  rollNumber: string;
  dueDate: string;
  phone?: string;
}

interface PaidStudent {
  name: string;
  rollNumber: string;
  paidDate: string;
  amount: number;
}

const { width } = Dimensions.get('window');

const FeeManagementContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'due' | 'paid'>('due');
  const [slideAnim] = useState(new Animated.Value(0));

  const handleTabChange = (tab: 'due' | 'paid') => {
    setActiveTab(tab);
    Animated.spring(slideAnim, {
      toValue: tab === 'due' ? 0 : 1,
      useNativeDriver: true,
      tension: 20,
      friction: 8,
    }).start();
  };

  const renderDueFeesTab = () => <DueFeesTab />;

  const renderPaidFeesTab = () => <PaidFeesTab />;

  return (
    <View style={styles.container}>
      {/* Tab Header */}
      <View style={styles.tabHeader}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'due' && styles.activeTab]}
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
            style={[styles.tab, activeTab === 'paid' && styles.activeTab]}
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
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -width],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.tabPanel}>{renderDueFeesTab()}</View>
          <View style={styles.tabPanel}>{renderPaidFeesTab()}</View>
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
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: Colors.primary,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
  tabContentContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  tabTitle: {
    fontSize: FontSizes.large,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  studentCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: FontSizes.medium,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  studentRoll: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
  dueDate: {
    fontSize: FontSizes.small,
    color: Colors.warning,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  paidDate: {
    fontSize: FontSizes.small,
    color: Colors.success,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  phoneNumber: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  amount: {
    fontSize: FontSizes.small,
    color: Colors.primary,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  paidBadge: {
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: FontSizes.small,
    fontWeight: '700',
    color: Colors.white,
  },
  paidText: {
    color: Colors.white,
  },
});

export default FeeManagementContainer;
