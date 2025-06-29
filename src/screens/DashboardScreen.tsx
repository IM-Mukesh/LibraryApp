// DashboardScreen.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Colors, Spacing } from '../theme/theme';
import HeaderCard from '../components/HeaderCard';
import SummaryCards from '../components/SummaryCards';
// import DueFeeList from '../components/DueFeesList';
import {
  dueStudents,
  paidStudents,
} from '../components/FeeManagement/fakeData';
import FeeManagementContainer from '../components/FeeManagement/FeeManagementContainer';
import FeeManagementTabView from '../components/FeeManagement/FeeManagementTabView';

const DashboardScreen: React.FC = () => {
  const dashboardData = {
    libraryName: 'MUKESH Library',
    adminName: 'Mukesh Kumar',
    adminEmail: 'mukesh@gmail.com',
    status: 'active' as const,
    totalStudents: 120,
    thisMonthAmount: 4000,
    lastMonthAmount: 3000,
    students: [
      {
        name: 'Ravi Sharma',
        rollNumber: 'A123',
        dueDate: '2025-06-15',
      },
      {
        name: 'Anita Singh',
        rollNumber: 'B456',
        dueDate: '2025-06-22',
      },
      {
        name: 'Raj Patel',
        rollNumber: 'C789',
        dueDate: '2025-06-10',
      },
      {
        name: 'Priya Gupta',
        rollNumber: 'D101',
        dueDate: '2025-06-08',
      },
      {
        name: 'Amit Kumar',
        rollNumber: 'E202',
        dueDate: '2025-06-25',
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Fixed Header Card */}
      <HeaderCard
        libraryName={dashboardData.libraryName}
        adminName={dashboardData.adminName}
        adminEmail={dashboardData.adminEmail}
        status={dashboardData.status}
      />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SummaryCards />

        {/* <DueFeeList students={dashboardData.students} /> */}
        <FeeManagementContainer />

        {/* <FeeManagementTabView
          dueStudents={dueStudents}
          paidStudents={paidStudents}
        /> */}
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
