// SummaryCards.tsx
import React, {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Colors, Spacing, FontSizes, Radius } from '../theme/theme';
import { setAuthToken, getDashboardStats, DashboardStats } from '../apis/api';

// Define the ref interface
export interface SummaryCardsRef {
  refresh: () => Promise<void>;
}

interface SummaryCardsProps {}

const SummaryCards = forwardRef<SummaryCardsRef, SummaryCardsProps>(
  (props, ref) => {
    const { token } = useSelector((state: RootState) => state.auth);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Ref to track if component is mounted
    const isMountedRef = useRef(true);
    const currentRequestRef = useRef<AbortController | null>(null);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        isMountedRef.current = false;
        if (currentRequestRef.current) {
          currentRequestRef.current.abort();
        }
      };
    }, []);

    const fetchStats = useCallback(
      async (isRefresh: boolean = false) => {
        if (!token) {
          setLoading(false);
          return;
        }

        // Cancel previous request if exists
        if (currentRequestRef.current) {
          currentRequestRef.current.abort();
        }

        // Create new abort controller
        const abortController = new AbortController();
        currentRequestRef.current = abortController;

        try {
          if (isRefresh) {
            setRefreshing(true);
            setError(null);
          } else {
            setLoading(true);
            setError(null);
          }

          // Set auth token (only if it hasn't been set or if it's different)
          setAuthToken(token);

          const data = await getDashboardStats();

          // Only update state if component is still mounted and request wasn't aborted
          if (isMountedRef.current && !abortController.signal.aborted) {
            setStats(data);
            setError(null);
          }
        } catch (error: any) {
          // Only handle error if component is mounted and request wasn't aborted
          if (isMountedRef.current && !abortController.signal.aborted) {
            const errorMessage =
              error.message || 'Failed to fetch dashboard stats';
            console.error('Dashboard stats error:', errorMessage);
            setError(errorMessage);

            // Keep existing data on refresh error, clear on initial load error
            if (!isRefresh) {
              setStats(null);
            }
          }
        } finally {
          if (isMountedRef.current && !abortController.signal.aborted) {
            setLoading(false);
            setRefreshing(false);
          }

          // Clear the current request ref
          if (currentRequestRef.current === abortController) {
            currentRequestRef.current = null;
          }
        }
      },
      [token],
    );

    // Expose refresh function via ref
    useImperativeHandle(
      ref,
      () => ({
        refresh: () => fetchStats(true),
      }),
      [fetchStats],
    );

    // Initial data fetch
    useEffect(() => {
      fetchStats(false);
    }, [fetchStats]);

    // Retry function
    const handleRetry = useCallback(() => {
      fetchStats(false);
    }, [fetchStats]);

    // Loading state for initial load
    if (loading && !stats) {
      return (
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      );
    }

    // Error state (only show if no data available)
    if (error && !stats) {
      return (
        <View style={[styles.container, styles.errorContainer]}>
          <Text style={styles.errorText}>Failed to load dashboard data</Text>
          <Text style={styles.errorSubText}>{error}</Text>
          <Text style={styles.retryText} onPress={handleRetry}>
            Tap to retry
          </Text>
        </View>
      );
    }

    // No data state (shouldn't happen with proper API, but good to have)
    if (!stats) {
      return (
        <View style={[styles.container, styles.errorContainer]}>
          <Text style={styles.errorText}>No dashboard data available</Text>
          <Text style={styles.retryText} onPress={handleRetry}>
            Tap to retry
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.wrapper}>
        {/* Show refresh indicator */}
        {refreshing && (
          <View style={styles.refreshIndicator}>
            <ActivityIndicator color={Colors.primary} size="small" />
          </View>
        )}

        {/* Show error banner if there's an error but we have existing data */}
        {error && stats && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>Failed to refresh data</Text>
          </View>
        )}

        <View style={styles.container}>
          <View style={styles.statBox}>
            <Text style={styles.label}>Total Students</Text>
            <Text style={styles.value}>{stats.totalStudents || 0}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <Text style={styles.label}>This Month</Text>
            <Text style={styles.value}>
              ₹{stats.currentMonthCollection?.total || 0}
            </Text>
            {/* <Text style={styles.subLabel}>
              Cash: ₹{stats.currentMonthCollection?.cash || 0}
            </Text>
            <Text style={styles.subLabel}>
              Online: ₹{stats.currentMonthCollection?.online || 0}
            </Text> */}
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <Text style={styles.label}>Last Month</Text>
            <Text style={styles.value}>
              ₹{stats.lastMonthCollection?.total || 0}
            </Text>
            {/* <Text style={styles.subLabel}>
              Cash: ₹{stats.lastMonthCollection?.cash || 0}
            </Text>
            <Text style={styles.subLabel}>
              Online: ₹{stats.lastMonthCollection?.online || 0}
            </Text> */}
          </View>
        </View>
      </View>
    );
  },
);

SummaryCards.displayName = 'SummaryCards';

export default SummaryCards;

const styles = StyleSheet.create({
  wrapper: {
    margin: Spacing.md,
  },
  container: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  loadingText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  errorContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  errorText: {
    fontSize: FontSizes.medium,
    color: Colors.error,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorSubText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  retryText: {
    fontSize: FontSizes.small,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    textDecorationLine: 'underline',
  },
  refreshIndicator: {
    position: 'absolute',
    top: -30,
    right: 16,
    zIndex: 1,
  },
  errorBanner: {
    backgroundColor: Colors.error + '20',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
  },
  errorBannerText: {
    fontSize: FontSizes.small,
    color: Colors.error,
    textAlign: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  subLabel: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  value: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
});
