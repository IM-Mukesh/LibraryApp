// components/FeeManagement/FeeManagementTabView.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Text,
} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
import DueFeesScene from './DueFeesScene';
// import PaidFeesScene from './PaidFeesScene';

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

interface FeeManagementTabViewProps {
  dueStudents: Student[];
  paidStudents: PaidStudent[];
  onRefresh?: () => Promise<void>;
}

const initialLayout = { width: Dimensions.get('window').width };

const FeeManagementTabView: React.FC<FeeManagementTabViewProps> = ({
  dueStudents,
  paidStudents,
  onRefresh,
}) => {
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const routes = useMemo(
    () => [
      {
        key: 'due',
        title: '📋 Due Fees',
        icon: 'alert-circle',
        count: dueStudents.length,
      },
      {
        key: 'paid',
        title: '✅ Paid Fees',
        icon: 'check-circle',
        count: paidStudents.length,
      },
    ],
    [dueStudents.length, paidStudents.length],
  );

  const renderScene = SceneMap({
    due: () => (
      <DueFeesScene
        students={dueStudents}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    ),
    paid: () => (
      //   <PaidFeesScene
      //     students={paidStudents}
      //     refreshing={refreshing}
      //     onRefresh={handleRefresh}
      //   />
      <DueFeesScene
        students={dueStudents}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    ),
  });

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        style={styles.tabBar}
        tabStyle={styles.tab}
        labelStyle={styles.tabLabel}
        activeColor={Colors.white}
        inactiveColor={Colors.textSecondary}
        renderBadge={({ route }: any) => {
          if (route.count > 0) {
            return (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      route.key === 'due' ? Colors.error : Colors.success,
                  },
                ]}
              >
                <Text style={styles.badgeText}>{route.count}</Text>
              </View>
            );
          }
          return null;
        }}
      />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor={Colors.primary}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        swipeEnabled={true}
        animationEnabled={true}
        style={styles.tabView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: Colors.primary,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  tab: {
    minHeight: 56,
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    textTransform: 'none',
  },
  indicator: {
    backgroundColor: Colors.white,
    height: 3,
    borderRadius: 2,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default FeeManagementTabView;
