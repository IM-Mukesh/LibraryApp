// src/components/Sidebar/Sidebar.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
import ConfirmationPopup from '../ConfirmationComponent';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  translateX: Animated.SharedValue<number>;
  overlayOpacity: Animated.SharedValue<number>;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.9;

const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  onClose,
  translateX,
  overlayOpacity,
}) => {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const dispatch = useDispatch();

  const menuItems = [
    { id: 1, title: 'Attendance' },
    { id: 2, title: 'Expenses' },
    { id: 3, title: 'Settings' },
  ];

  const handleMenuPress = (item: { id: number; title: string }) => {
    console.log(`Pressed: ${item.title}`);
    // Add your navigation logic here
    onClose();
  };

  const handleLogoutPress = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setShowLogoutConfirmation(false);
    onClose();
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  // Animated styles
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (!isVisible) return null;

  return (
    <>
      <View
        style={styles.container}
        pointerEvents={isVisible ? 'auto' : 'none'}
      >
        {/* Overlay */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.overlay, overlayStyle]} />
        </TouchableWithoutFeedback>

        {/* Sidebar */}
        <Animated.View style={[styles.sidebar, sidebarStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Menu</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                disabled={true}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Section */}
          <View style={styles.logoutSection}>
            <View style={styles.logoutDivider} />
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogoutPress}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Dashboard v1.0</Text>
          </View>
        </Animated.View>
      </View>

      {/* Logout Confirmation Popup */}
      <ConfirmationPopup
        visible={showLogoutConfirmation}
        title="Confirm Logout"
        message="Are you sure you want to logout from your account?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        type="warning"
        confirmButtonColor={Colors.error}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    elevation: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    bottom: 0,
    backgroundColor: Colors.card,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 1001,
    borderTopRightRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? Spacing.md : Spacing.xl,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.primary,
    borderTopRightRadius: Radius.lg,
  },
  headerTitle: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    color: Colors.white,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  closeIcon: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '600',
  },
  menuContainer: {
    flex: 1,
    paddingTop: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  menuTitle: {
    flex: 1,
    fontSize: FontSizes.medium,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '300',
  },
  logoutSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  logoutDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
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
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl * 2 : Spacing.xl,
    paddingTop: Spacing.md,
  },
  footerText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default Sidebar;
