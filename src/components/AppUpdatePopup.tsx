import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Linking,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Spacing, FontSizes, Radius } from '../theme/theme';

interface AppVersion {
  currentVersion: string;
  latestVersion: string;
  updateUrl: string;
  releaseNotes?: string;
  forceUpdate?: boolean;
}

interface UpdatePopupProps {
  visible: boolean;
  onClose: () => void;
  versionData: AppVersion;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AppUpdatePopup: React.FC<UpdatePopupProps> = ({
  visible,
  onClose,
  versionData,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      startOpenAnimation();
    } else {
      startCloseAnimation();
    }
  }, [visible]);

  const startOpenAnimation = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startCloseAnimation = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
    });
  };

  const handleUpdate = async () => {
    try {
      console.log('updateurl is', versionData.updateUrl);

      const supported = await Linking.canOpenURL(versionData.updateUrl);
      console.log('issupp', supported);

      await Linking.openURL(versionData.updateUrl);
      //   if (supported) {
      //     await Linking.openURL(versionData.updateUrl);
      //     if (!versionData.forceUpdate) {
      //       onClose();
      //     }
      //   } else {
      //     await Linking.openURL(versionData.updateUrl);
      //     return;
      //     Alert.alert(
      //       'Unable to Open',
      //       'Cannot open the update link. Please update manually from your app store.',
      //       [{ text: 'OK', style: 'default' }],
      //     );
      //   }
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while trying to open the update link.',
        [{ text: 'OK', style: 'default' }],
      );
    }
  };

  const handleClose = () => {
    if (!versionData.forceUpdate) {
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.3)" barStyle="light-content" />

      {/* Semi-transparent Background */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        {/* Main Popup Container */}
        <Animated.View
          style={[
            styles.popupContainer,
            {
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          {/* Close Button - Only show if not force update */}
          {!versionData.forceUpdate && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          )}

          {/* Content Card */}
          <View style={styles.contentCard}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {versionData.forceUpdate
                  ? 'Update Required'
                  : 'Update Available'}
              </Text>

              <View style={styles.versionContainer}>
                <Text style={styles.versionText}>
                  V{versionData.currentVersion} → V{versionData.latestVersion}
                </Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.message}>
                {versionData.forceUpdate
                  ? 'This update contains critical fixes. Please update to continue.'
                  : 'A newer version is available with improvements and bug fixes.'}
              </Text>

              {versionData.releaseNotes && (
                <View style={styles.releaseNotesContainer}>
                  <Text style={styles.releaseNotesTitle}>What's New:</Text>
                  <Text style={styles.releaseNotes}>
                    {versionData.releaseNotes}
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.secondary]}
                  style={styles.updateButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.updateButtonText}>
                    {versionData.forceUpdate ? 'Update Now' : 'Update'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {!versionData.forceUpdate && (
                <TouchableOpacity
                  style={styles.laterButton}
                  onPress={handleClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.laterButtonText}>Later</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// API Service
export class UpdateService {
  private static readonly API_URL = 'https://api.yourapp.com/version';

  static async checkForUpdates(
    currentVersion: string,
  ): Promise<AppVersion | null> {
    try {
      const response = await fetch(this.API_URL);
      const data = await response.json();

      if (this.isNewerVersion(data.latestVersion, currentVersion)) {
        return {
          currentVersion,
          latestVersion: data.latestVersion,
          updateUrl: data.updateUrl,
          releaseNotes: data.releaseNotes,
          forceUpdate: data.forceUpdate || false,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return null;
    }
  }

  private static isNewerVersion(latest: string, current: string): boolean {
    const latestParts = latest.split('.').map(Number);
    const currentParts = current.split('.').map(Number);

    for (
      let i = 0;
      i < Math.max(latestParts.length, currentParts.length);
      i++
    ) {
      const latestPart = latestParts[i] || 0;
      const currentPart = currentParts[i] || 0;

      if (latestPart > currentPart) return true;
      if (latestPart < currentPart) return false;
    }

    return false;
  }
}

// Usage Hook
export const useAppUpdate = (currentVersion: string) => {
  const [updateData, setUpdateData] = useState<AppVersion | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkForUpdates = async () => {
    setIsLoading(true);
    try {
      const update = await UpdateService.checkForUpdates(currentVersion);
      setUpdateData(update);
    } catch (error) {
      console.error('Update check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hideUpdate = () => {
    setUpdateData(null);
  };

  return {
    updateData,
    isLoading,
    checkForUpdates,
    hideUpdate,
  };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  popupContainer: {
    width: '100%',
    maxWidth: 340,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  closeIcon: {
    fontSize: 20,
    color: Colors.textSecondary,
    fontWeight: '300',
    marginTop: -2,
  },
  contentCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  versionContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.lg,
  },
  versionText: {
    fontSize: FontSizes.small + 2,
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  releaseNotesContainer: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  releaseNotesTitle: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  releaseNotes: {
    fontSize: FontSizes.small + 1,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    gap: Spacing.sm,
  },
  updateButton: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  updateButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.white,
  },
  laterButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    borderRadius: Radius.lg,
    backgroundColor: 'transparent',
  },
  laterButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});

export default AppUpdatePopup;
