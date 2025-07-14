import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  BackHandler,
  Dimensions,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { getLatestAppVersion } from '../apis/api';
import { buildVersionData } from '../utils/buildVersionData';
import { VersionData } from '../types';

import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Spacing } from '../theme/theme';
import HeaderCard from '../components/HeaderCard';
import SummaryCards from '../components/SummaryCards';
import FeeManagementContainer from '../components/FeeManagement/FeeManagementContainer';
import Sidebar from '../components/Sidebar/Sidebar';
import ConfirmationPopup from '../components/ConfirmationComponent';
import AppUpdatePopup from '../components/AppUpdatePopup';
import { APP_VERSION } from '../apis/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.9;

const DashboardScreen: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [latestVersionData, setLatestVersionData] =
    useState<VersionData | null>(null);
  const [hasDismissedUpdate, setHasDismissedUpdate] = useState(false);

  const summaryCardsRef = useRef<any>(null);
  const feeManagementRef = useRef<any>(null);

  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const overlayOpacity = useSharedValue(0);

  const navigation = useNavigation();

  const shouldShowUpdatePopup =
    latestVersionData &&
    latestVersionData.latestVersion !== APP_VERSION &&
    !hasDismissedUpdate;

  useEffect(() => {
    const checkVersionUpdate = async () => {
      try {
        const fetchedVersion = await getLatestAppVersion();

        if (
          fetchedVersion &&
          fetchedVersion.latestVersion &&
          fetchedVersion.latestVersion > APP_VERSION
        ) {
          const versionData = buildVersionData(fetchedVersion);
          setLatestVersionData(versionData);
        }
      } catch (error) {
        // console.error('Version check failed:', error);
      }
    };

    checkVersionUpdate();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (sidebarVisible) {
          closeSidebar();
          return true;
        }

        if (navigation.canGoBack()) {
          return false; // Let React Navigation handle back
        }

        setShowExitConfirmation(true);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [sidebarVisible, navigation]),
  );

  const openSidebar = useCallback(() => {
    translateX.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
    });
    overlayOpacity.value = withTiming(1, { duration: 300 });
    setSidebarVisible(true);
  }, [translateX, overlayOpacity]);

  const closeSidebar = useCallback(() => {
    translateX.value = withSpring(-SIDEBAR_WIDTH, {
      damping: 20,
      stiffness: 90,
    });
    overlayOpacity.value = withTiming(0, { duration: 300 });

    setTimeout(() => {
      setSidebarVisible(false);
    }, 300);
  }, [translateX, overlayOpacity]);

  const handleExitApp = () => {
    setShowExitConfirmation(false);
    BackHandler.exitApp();
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  const ExitIcon = () => (
    <View style={styles.exitIconContainer}>
      <Text style={styles.exitIcon}>🚪</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {shouldShowUpdatePopup && latestVersionData && (
        <AppUpdatePopup
          visible={true}
          onClose={() => setHasDismissedUpdate(true)}
          versionData={latestVersionData}
        />
      )}

      <View style={styles.fixedContent}>
        <HeaderCard onProfilePress={openSidebar} />
        <SummaryCards ref={summaryCardsRef} />
        <FeeManagementContainer refreshing={false} />
      </View>

      <Sidebar
        isVisible={sidebarVisible}
        onClose={closeSidebar}
        translateX={translateX}
        overlayOpacity={overlayOpacity}
      />

      <ConfirmationPopup
        visible={showExitConfirmation}
        title="Exit App"
        message="Are you sure you want to exit the application?"
        confirmText="Exit"
        cancelText="Stay"
        type="warning"
        icon={<ExitIcon />}
        onConfirm={handleExitApp}
        onCancel={handleCancelExit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  fixedContent: {
    marginTop: Spacing.sm,
    flex: 1,
    paddingBottom: Spacing.md,
  },
  exitIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitIcon: {
    fontSize: 24,
  },
});

export default DashboardScreen;
