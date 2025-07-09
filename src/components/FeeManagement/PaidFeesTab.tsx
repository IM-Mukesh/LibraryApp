// components/FeeManagement/PaidFeesTab.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import dayjs from 'dayjs';
import { Colors, Spacing, FontSizes } from '../../theme/theme';
import PaidStudentCard from './PaidStudentCard';
import { getRecentPayments } from '../../apis/api'; // ✅ API import

interface PaidStudent {
  name: string;
  rollNumber: string;
  paidDate: string;
  amount: number;
}

const PaidFeesTab: React.FC = () => {
  const [students, setStudents] = useState<PaidStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const refreshRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchRecentPayments();
  }, []);

  const fetchRecentPayments = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      const data = await getRecentPayments();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching recent payments:', error);
    } finally {
      setLoading(false);
      if (isRefreshing) {
        setRefreshing(false);
      }
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleRefresh = () => {
    if (refreshing || loading) return;

    setRefreshing(true);

    // Start rotation animation
    refreshRotateAnim.setValue(0);
    Animated.timing(refreshRotateAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Fetch fresh data
    fetchRecentPayments(true);
  };

  const sortedStudents = [...students].sort((a, b) =>
    dayjs(b.paidDate).diff(dayjs(a.paidDate)),
  );

  const totalAmount = students.reduce(
    (sum, student) => sum + student.amount,
    0,
  );

  const refreshRotate = refreshRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'clamp',
  });

  // Refresh Icon Component
  const RefreshIcon = ({ size = 20, color = Colors.primary }) => (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: size,
          color: color,
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: size,
        }}
      >
        ↻
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Recent Payments</Text>
          <Text style={styles.totalAmount}>
            Total: ₹{totalAmount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{students.length}</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            activeOpacity={0.7}
            disabled={refreshing}
          >
            <Animated.View
              style={[
                styles.refreshIconContainer,
                {
                  transform: [{ rotate: refreshRotate }],
                },
                refreshing && styles.refreshingIcon,
              ]}
            >
              <RefreshIcon
                size={18}
                color={refreshing ? Colors.disabled : Colors.primary}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sortedStudents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💰</Text>
            <Text style={styles.emptyTitle}>No Recent Payments</Text>
            <Text style={styles.emptySubtitle}>Paid fees will appear here</Text>
          </View>
        ) : (
          sortedStudents.map((student, index) => (
            <PaidStudentCard
              key={`${student.rollNumber}-${student.paidDate}`}
              student={student}
              index={index}
            />
          ))
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  totalAmount: {
    fontSize: FontSizes.medium,
    color: Colors.success,
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: Colors.success,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minWidth: 40,
    alignItems: 'center',
  },
  countText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: 'bold',
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  refreshIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshingIcon: {
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default PaidFeesTab;
