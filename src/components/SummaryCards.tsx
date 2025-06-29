// components/SummaryCard.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Colors, Spacing, FontSizes, Radius } from '../theme/theme';
import { setAuthToken, getDashboardStats, DashboardStats } from '../apis/api';

const SummaryCard: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!token) return;

        setAuthToken(token);

        const data = await getDashboardStats();
        setStats(data);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to fetch summary');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load Summary data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={styles.label}>Total Students</Text>
        <Text style={styles.value}>{stats.totalStudents}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statBox}>
        <Text style={styles.label}>Current Month</Text>
        <Text style={styles.value}>₹{stats.currentMonthCollection}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statBox}>
        <Text style={styles.label}>Last Month</Text>
        <Text style={styles.value}>₹{stats.lastMonthCollection}</Text>
      </View>
    </View>
  );
};

export default SummaryCard;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    margin: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  loadingContainer: {
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FontSizes.medium,
    color: Colors.error,
    textAlign: 'center',
  },
});
