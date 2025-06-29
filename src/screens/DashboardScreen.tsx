// DashboardScreen.tsx
import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Colors, Spacing } from '../theme/theme';
import HeaderCard from '../components/HeaderCard';
import SummaryCards from '../components/SummaryCards';
import FeeManagementContainer from '../components/FeeManagement/FeeManagementContainer';

const DashboardScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const summaryCardsRef = useRef<any>(null);
  const feeManagementRef = useRef<any>(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      // Create an array of promises for all refresh operations
      const refreshPromises = [];

      // Add SummaryCards refresh if ref exists
      if (summaryCardsRef.current?.refresh) {
        refreshPromises.push(summaryCardsRef.current.refresh());
      }

      // Add FeeManagement refresh if ref exists
      if (feeManagementRef.current?.refresh) {
        refreshPromises.push(feeManagementRef.current.refresh());
      }

      // Wait for all refresh operations to complete
      await Promise.allSettled(refreshPromises);
    } catch (error) {
      console.error('Dashboard refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <HeaderCard />

      {/* Scrollable Content with Pull-to-Refresh */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
            title="Refreshing..."
            titleColor={Colors.textSecondary}
          />
        }
      >
        <SummaryCards ref={summaryCardsRef} />

        {/* <FeeManagementContainer ref={feeManagementRef} />  */}
        <FeeManagementContainer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.md,
  },
});

export default DashboardScreen;
