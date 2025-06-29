import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../theme/theme';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileInfoCard from '../components/Profile/ProfileInfoCard';
import ActionButton from '../components/Profile/ActionButton';
// import ChangePasswordModal from '../components/Profile/ChangePasswordModal';
import { useDispatch, useSelector } from 'react-redux';
import { setPasswordSheetOpen } from '../redux/slices/bottomSheetSlice';
import { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

const { width, height } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const dispatch = useDispatch();

  const library = useSelector((state: RootState) => state?.auth?.library);
  const isPasswordSheetOpen = useSelector(
    (state: RootState) => state?.password?.isOpen,
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleChangePassword = () => {
    // dispatch(setPasswordSheetOpen());
  };

  const handleSupport = () => {};

  const handleLogout = () => {
    dispatch(logout());
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalVisible(false);
  };

  const handlePasswordChange = (passwords: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsPasswordModalVisible(false);
  };

  if (!library) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProfileHeader
            libraryName={library.name}
            adminName={library.adminName}
          />

          <View style={styles.infoSection}>
            <ProfileInfoCard
              email={library.adminEmail}
              phone={library.adminPhone}
              address={library.address}
            />
          </View>

          <View style={styles.actionsSection}>
            <ActionButton
              title="Change Password"
              iconName="lock"
              onPress={handleChangePassword}
              style={styles.actionButton}
            />

            <ActionButton
              title="Support"
              iconName="help"
              onPress={handleSupport}
              style={styles.actionButton}
            />
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* {isPasswordSheetOpen && <ChangePasswordModal />} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.large,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  infoSection: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionsSection: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionButton: {
    marginBottom: Spacing.md,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.error,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: FontSizes.medium,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;
