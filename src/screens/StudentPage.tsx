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
import { getAllStudents, setAuthToken, Student } from '../apis/api';
import { setStudentPayment } from '../redux/slices/paymentSlice';
import { setStudents } from '../redux/slices/studentSlice';
import { useHideTabBarOnKeyboard } from '../hooks/useHideTabBarOnKeyboard';
import {
  useFocusEffect,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
// import { Student } from '../types/student';

const { width } = Dimensions.get('window');

const StudentPage: React.FC = ({ navigation }: any) => {
  useHideTabBarOnKeyboard(navigation);
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const students = useSelector((state: RootState) => state.student.students);

  const route = useRoute();
  const nav = useNavigation();
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    try {
      if (token) setAuthToken(token);
      const data = await getAllStudents();
      dispatch(setStudents(data));
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, dispatch]);

  // Initial load and refresh when navigating back from student creation
  useFocusEffect(
    useCallback(() => {
      if ((route as any)?.params?.studentCreated) {
        fetchStudents();
        // Reset the param so it doesn't repeat
        navigation.setParams({ studentCreated: false });
      }
    }, [fetchStudents, route, navigation]),
  );

  // Initial load
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
  };

  const renderStudent = useCallback(
    ({ item }: { item: Student }) => (
      <StudentCard
        student={item}
        onPaymentPress={() => handlePaymentPress(item)}
        onDetailsPress={() => {}}
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
          placeholder="Name, mobile, or Aadhar..."
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
});

export default StudentPage;
