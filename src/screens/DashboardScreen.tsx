// DashboardScreen.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl,
  Text,
  View,
  Dimensions,
  BackHandler,
} from 'react-native';

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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.9;

const DashboardScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const summaryCardsRef = useRef<any>(null);
  const feeManagementRef = useRef<any>(null);

  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const overlayOpacity = useSharedValue(0);

  // Handle back button press
  useEffect(() => {
    const handleBackPress = () => {
      if (sidebarVisible) {
        closeSidebar();
        return true;
      }
      setShowExitConfirmation(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => backHandler.remove();
  }, [sidebarVisible]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const refreshPromises = [];
      if (summaryCardsRef.current?.refresh) {
        refreshPromises.push(summaryCardsRef.current.refresh());
      }
      if (feeManagementRef.current?.refresh) {
        refreshPromises.push(feeManagementRef.current.refresh());
      }
      await Promise.allSettled(refreshPromises);
    } catch (error) {
      console.error('Dashboard refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

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

    // Delay hiding the sidebar to allow animation to complete
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!sidebarVisible}
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
        <HeaderCard onProfilePress={openSidebar} />
        <SummaryCards ref={summaryCardsRef} />
        <FeeManagementContainer />
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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

// // DashboardScreen.tsx
// import React, { useState, useCallback, useRef } from 'react';
// import {
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   ScrollView,
//   RefreshControl,
//   View,
//   Dimensions,
// } from 'react-native';
// import {
//   PanGestureHandler,
//   GestureHandlerRootView,
//   State,
// } from 'react-native-gesture-handler';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   useAnimatedGestureHandler,
//   runOnJS,
//   withSpring,
//   interpolate,
//   Extrapolate,
// } from 'react-native-reanimated';

// import { Colors, Spacing } from '../theme/theme';
// import HeaderCard from '../components/HeaderCard';
// import SummaryCards from '../components/SummaryCards';
// import FeeManagementContainer from '../components/FeeManagement/FeeManagementContainer';
// import Sidebar from '../components/Sidebar/Sidebar';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.9;
// const EDGE_DETECTION_WIDTH = 20; // Detect swipe from first 20px of screen
// const SWIPE_THRESHOLD = SIDEBAR_WIDTH * 0.3; // 30% of sidebar width to trigger open/close

// const DashboardScreen: React.FC = () => {
//   const [refreshing, setRefreshing] = useState(false);
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const summaryCardsRef = useRef<any>(null);
//   const feeManagementRef = useRef<any>(null);

//   // Animated values
//   const translateX = useSharedValue(-SIDEBAR_WIDTH);
//   const overlayOpacity = useSharedValue(0);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try {
//       const refreshPromises = [];

//       if (summaryCardsRef.current?.refresh) {
//         refreshPromises.push(summaryCardsRef.current.refresh());
//       }

//       if (feeManagementRef.current?.refresh) {
//         refreshPromises.push(feeManagementRef.current.refresh());
//       }

//       await Promise.allSettled(refreshPromises);
//     } catch (error) {
//       console.error('Dashboard refresh error:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   }, []);

//   const openSidebar = useCallback(() => {
//     setSidebarVisible(true);
//     translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
//     overlayOpacity.value = withSpring(1, { damping: 20, stiffness: 300 });
//   }, [translateX, overlayOpacity]);

//   const closeSidebar = useCallback(() => {
//     translateX.value = withSpring(-SIDEBAR_WIDTH, { damping: 20, stiffness: 300 });
//     overlayOpacity.value = withSpring(0, { damping: 20, stiffness: 300 }, () => {
//       runOnJS(setSidebarVisible)(false);
//     });
//   }, [translateX, overlayOpacity]);

//   // Gesture handler for opening sidebar from left edge
//   const openGestureHandler = useAnimatedGestureHandler({
//     onStart: (_, context) => {
//       context.startX = translateX.value;
//     },
//     onActive: (event, context) => {
//       // Only allow opening when sidebar is closed and gesture starts from left edge
//       if (!sidebarVisible && event.absoluteX <= EDGE_DETECTION_WIDTH + event.translationX) {
//         const newTranslateX = Math.max(
//           -SIDEBAR_WIDTH,
//           Math.min(0, context.startX + event.translationX)
//         );
//         translateX.value = newTranslateX;

//         // Update overlay opacity based on sidebar position
//         const progress = interpolate(
//           newTranslateX,
//           [-SIDEBAR_WIDTH, 0],
//           [0, 1],
//           Extrapolate.CLAMP
//         );
//         overlayOpacity.value = progress;

//         // Show sidebar when user starts dragging
//         if (newTranslateX > -SIDEBAR_WIDTH && !sidebarVisible) {
//           runOnJS(setSidebarVisible)(true);
//         }
//       }
//     },
//     onEnd: (event) => {
//       if (!sidebarVisible) return;

//       const shouldOpen =
//         event.translationX > SWIPE_THRESHOLD ||
//         (event.translationX > 0 && event.velocityX > 500);

//       if (shouldOpen) {
//         translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
//         overlayOpacity.value = withSpring(1, { damping: 20, stiffness: 300 });
//       } else {
//         translateX.value = withSpring(-SIDEBAR_WIDTH, { damping: 20, stiffness: 300 });
//         overlayOpacity.value = withSpring(0, { damping: 20, stiffness: 300 }, () => {
//           runOnJS(setSidebarVisible)(false);
//         });
//       }
//     },
//   });

//   // Gesture handler for closing sidebar
//   const closeGestureHandler = useAnimatedGestureHandler({
//     onStart: (_, context) => {
//       context.startX = translateX.value;
//     },
//     onActive: (event, context) => {
//       if (sidebarVisible) {
//         const newTranslateX = Math.max(
//           -SIDEBAR_WIDTH,
//           Math.min(0, context.startX + event.translationX)
//         );
//         translateX.value = newTranslateX;

//         // Update overlay opacity
//         const progress = interpolate(
//           newTranslateX,
//           [-SIDEBAR_WIDTH, 0],
//           [0, 1],
//           Extrapolate.CLAMP
//         );
//         overlayOpacity.value = progress;
//       }
//     },
//     onEnd: (event) => {
//       if (!sidebarVisible) return;

//       const shouldClose =
//         event.translationX < -SWIPE_THRESHOLD ||
//         (event.translationX < 0 && event.velocityX < -500);

//       if (shouldClose) {
//         translateX.value = withSpring(-SIDEBAR_WIDTH, { damping: 20, stiffness: 300 });
//         overlayOpacity.value = withSpring(0, { damping: 20, stiffness: 300 }, () => {
//           runOnJS(setSidebarVisible)(false);
//         });
//       } else {
//         translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
//         overlayOpacity.value = withSpring(1, { damping: 20, stiffness: 300 });
//       }
//     },
//   });

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <SafeAreaView style={styles.container}>
//         <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

//         {/* Main Content with Gesture Detection */}
//         <PanGestureHandler
//           onGestureEvent={sidebarVisible ? closeGestureHandler : openGestureHandler}
//           activeOffsetX={[-10, 10]}
//           failOffsetY={[-20, 20]}
//         >
//           <Animated.View style={styles.gestureContainer}>
//             <ScrollView
//               style={styles.scrollView}
//               contentContainerStyle={styles.scrollContent}
//               showsVerticalScrollIndicator={false}
//               scrollEnabled={!sidebarVisible}
//               refreshControl={
//                 <RefreshControl
//                   refreshing={refreshing}
//                   onRefresh={onRefresh}
//                   colors={[Colors.primary]}
//                   tintColor={Colors.primary}
//                   title="Refreshing..."
//                   titleColor={Colors.textSecondary}
//                 />
//               }
//             >
//               <HeaderCard />
//               <SummaryCards ref={summaryCardsRef} />
//               <FeeManagementContainer />
//             </ScrollView>
//           </Animated.View>
//         </PanGestureHandler>

//         {/* Sidebar with higher zIndex to appear above bottom tabs */}
//         <Sidebar
//           isVisible={sidebarVisible}
//           onClose={closeSidebar}
//           translateX={translateX}
//           overlayOpacity={overlayOpacity}
//         />
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   gestureContainer: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: Spacing.md,
//   },
// });

// export default DashboardScreen;
