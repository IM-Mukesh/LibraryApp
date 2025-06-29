// src/components/StudentPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../theme/theme';
import PlusButton from '../components/Operation/PlusButton';
import SearchField from '../components/Operation/SearchField';
import StudentCard from '../components/Operation/StudentCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAllStudents, setAuthToken, Student } from '../apis/api';
import { setStudentPayment } from '../redux/slices/paymentSlice';
const { width } = Dimensions.get('window');
import { useHideTabBarOnKeyboard } from '../hooks/useHideTabBarOnKeyboard';

const StudentPage: React.FC = ({ navigation }: any) => {
  useHideTabBarOnKeyboard(navigation);
  const { token } = useSelector((state: RootState) => state.auth);
  // const navigationWithProp = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentBottomsheet, setPaymentBottomsheet] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      if (token) setAuthToken(token);
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredStudents(
        students.filter(
          s =>
            s.name.toLowerCase().includes(query) ||
            s.mobile.includes(query) ||
            s.aadhar.includes(query),
        ),
      );
    }
  }, [searchQuery, students]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
  };

  const handlePlusPress = (): void => {
    navigation.navigate('StudentEnroll');
  };

  const handlePaymentPress = (student: Student) => {
    dispatch(setStudentPayment(student));
    navigation.navigate('StudentPayment');
    // navigationWithProp.navigate('StudentPayment', { studentData: student });
  };

  const renderStudent = useCallback(
    ({ item }: { item: Student }) => (
      <StudentCard
        student={item}
        onPaymentPress={() => handlePaymentPress(item)}
      />
    ),
    [],
  );

  const keyExtractor = useCallback((item: Student) => item._id, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <SearchField
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, mobile, or Aadhar..."
        />
        <PlusButton onPress={handlePlusPress} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ marginTop: 50 }}
          />
        ) : filteredStudents.length > 0 ? (
          <FlatList
            data={filteredStudents}
            renderItem={renderStudent}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            removeClippedSubviews
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No students found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search criteria
            </Text>
          </View>
        )}
      </View>

      {/* Payment Debug Info */}
      {paymentBottomsheet && selectedStudent && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Payment Bottomsheet: Open for {selectedStudent.name}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setPaymentBottomsheet(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  listContainer: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  separator: {
    height: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  debugInfo: {
    position: 'absolute',
    bottom: 50,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  debugText: {
    color: Colors.white,
    fontSize: FontSizes.medium,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  closeButton: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
});

export default StudentPage;
