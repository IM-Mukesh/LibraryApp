// components/FeeManagement/DueFeesScene.tsx
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import dayjs from 'dayjs';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
import ProfessionalDueCard from './ProfessionalDueCard';

interface Student {
  name: string;
  rollNumber: string;
  dueDate: string;
  phone?: string;
}

interface StudentWithStatus extends Student {
  daysLeft: number;
  isOverdue: boolean;
}

interface DueFeesSceneProps {
  students: Student[];
  refreshing: boolean;
  onRefresh: () => void;
}

const { width, height } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;

const DueFeesScene: React.FC<DueFeesSceneProps> = ({
  students,
  refreshing,
  onRefresh,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
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
  }, []);

  const processedStudents = useMemo((): StudentWithStatus[] => {
    const today = dayjs();

    const studentsWithStatus: StudentWithStatus[] = students.map(student => {
      const dueDate = dayjs(student.dueDate);
      const daysLeft = dueDate.diff(today, 'day');
      const isOverdue = daysLeft < 0;

      return {
        ...student,
        daysLeft,
        isOverdue,
      };
    });

    // Filter: overdue or due within 7 days
    const filteredStudents = studentsWithStatus.filter(
      student => student.isOverdue || student.daysLeft <= 7,
    );

    // Sort: overdue first (most overdue first), then by days left
    return filteredStudents.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      if (a.isOverdue && b.isOverdue) return a.daysLeft - b.daysLeft;
      return a.daysLeft - b.daysLeft;
    });
  }, [students]);

  const paginatedStudents = useMemo(() => {
    return processedStudents.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [processedStudents, currentPage]);

  const totalOverdue = useMemo(() => {
    return processedStudents.filter(student => student.isOverdue).length;
  }, [processedStudents]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && paginatedStudents.length < processedStudents.length) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoadingMore(false);
      }, 500);
    }
  }, [isLoadingMore, paginatedStudents.length, processedStudents.length]);

  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    onRefresh();
  }, [onRefresh]);

  const renderHeader = useCallback(() => {
    if (processedStudents.length === 0) return null;

    return (
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statBadge, { backgroundColor: Colors.error }]}>
              <Text style={styles.statNumber}>{totalOverdue}</Text>
            </View>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View
              style={[styles.statBadge, { backgroundColor: Colors.warning }]}
            >
              <Text style={styles.statNumber}>
                {processedStudents.length - totalOverdue}
              </Text>
            </View>
            <Text style={styles.statLabel}>Due Soon</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View
              style={[styles.statBadge, { backgroundColor: Colors.primary }]}
            >
              <Text style={styles.statNumber}>{processedStudents.length}</Text>
            </View>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </Animated.View>
    );
  }, [processedStudents.length, totalOverdue, fadeAnim, slideAnim]);

  const renderEmptyState = useCallback(
    () => (
      <Animated.View
        style={[
          styles.emptyContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyIcon}>🎉</Text>
        </View>
        <Text style={styles.emptyTitle}>All Caught Up!</Text>
        <Text style={styles.emptySubtitle}>
          No pending payments at the moment.{'\n'}
          Great job managing your fees!
        </Text>
      </Animated.View>
    ),
    [fadeAnim, slideAnim],
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <Animated.View
          style={[
            styles.loadingDot,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.loadingText}>Loading more...</Text>
        </Animated.View>
      </View>
    );
  }, [isLoadingMore, fadeAnim]);

  const renderItem = useCallback(
    ({ item, index }: { item: StudentWithStatus; index: number }) => (
      <ProfessionalDueCard student={item} index={index} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: StudentWithStatus, index: number) =>
      `${item.rollNumber}-${item.dueDate}-${index}`,
    [],
  );

  if (processedStudents.length === 0) {
    return <View style={styles.container}>{renderEmptyState()}</View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={paginatedStudents}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
            progressBackgroundColor={Colors.card}
          />
        }
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={5}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 140,
          offset: 140 * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerContainer: {
    marginBottom: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statNumber: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.white,
  },
  statLabel: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl * 2,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  loadingDot: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});

export default DueFeesScene;
