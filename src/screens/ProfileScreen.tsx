import React, { useRef, useEffect, useState } from 'react';
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
  Image,
  PanResponder,
} from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../theme/theme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const { width, height } = Dimensions.get('window');

const ProfileScreen: React.FC = ({ navigation }: any) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const cardSlideAnim = useRef(new Animated.Value(100)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const [scrollY] = useState(new Animated.Value(0));
  const dispatch = useDispatch();
  const library = useSelector((state: RootState) => state?.auth?.library);

  useEffect(() => {
    // Main entrance animation
    Animated.stagger(150, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleChangePassword = () => {
    // Disabled for now
    navigation.navigate('changepassword');
  };

  const handleSupport = () => {
    // Disabled for now
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!library) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[styles.loadingCard, { transform: [{ scale: pulseAnim }] }]}
          >
            <View style={styles.loadingIconContainer}>
              <Animated.View
                style={[
                  styles.loadingIcon,
                  { transform: [{ rotate: rotateInterpolate }] },
                ]}
              />
            </View>
            <Text style={styles.loadingText}>Loading Your Profile</Text>
            <View style={styles.loadingBarContainer}>
              <Animated.View
                style={[
                  styles.loadingBar,
                  {
                    transform: [{ translateX: shimmerTranslate }],
                  },
                ]}
              />
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {/* Header Section with Gradient */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: headerOpacity,
              transform: [
                { translateY: headerSlideAnim },
                { scale: headerScale },
              ],
            },
          ]}
        >
          <View style={styles.gradientOverlay} />
          <View style={styles.headerContent}>
            <Animated.View
              style={[
                styles.avatarContainer,
                {
                  transform: [
                    { scale: pulseAnim },
                    { translateY: floatTranslate },
                  ],
                },
              ]}
            >
              <View style={styles.avatarGlow} />
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {library.adminName?.charAt(0)?.toUpperCase() || 'L'}
                </Text>
              </View>
              <View style={styles.statusIndicator} />
            </Animated.View>

            <Animated.View
              style={[styles.headerTextContainer, { opacity: fadeAnim }]}
            >
              <Text style={styles.libraryName}>
                {library.name.toUpperCase()}
              </Text>
              <Text style={styles.adminName}>
                Administrator: {library.adminName}
              </Text>
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>PREMIUM</Text>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* Floating particles */}
          <View style={styles.particlesContainer}>
            {[...Array(6)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.particle,
                  {
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    transform: [
                      {
                        translateY: floatAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -15 - i * 3],
                        }),
                      },
                      { rotate: rotateInterpolate },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Profile Info Card */}
        <Animated.View
          style={[
            styles.infoCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: cardSlideAnim }],
            },
          ]}
        >
          <View style={styles.shimmerContainer}>
            <Animated.View
              style={[
                styles.shimmerEffect,
                { transform: [{ translateX: shimmerTranslate }] },
              ]}
            />
          </View>

          <Text style={styles.cardTitle}>Contact Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>📧</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{library.adminEmail}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>📱</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{library.adminPhone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>📍</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Library Address</Text>
              <Text style={styles.infoValue}>{library.address}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={[
            styles.actionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: buttonScaleAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Account Management</Text>

          <TouchableOpacity
            style={[styles.actionButton, false && styles.disabledButton]}
            onPress={handleChangePassword}
            activeOpacity={0.7}
            disabled={false}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonIcon}>
                <Text style={styles.buttonIconText}>🔐</Text>
              </View>
              <View style={styles.buttonTextContainer}>
                <Text
                  style={[styles.buttonTitle, false && styles.disabledText]}
                >
                  Change Password
                </Text>
                <Text
                  style={[styles.buttonSubtitle, false && styles.disabledText]}
                >
                  Update your security credentials
                </Text>
              </View>
              <View style={styles.buttonArrow}>
                <Text style={[styles.arrowText, false && styles.disabledText]}>
                  ›
                </Text>
              </View>
            </View>
            {/* <View style={styles.disabledOverlay}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.disabledButton]}
            onPress={handleSupport}
            activeOpacity={0.7}
            disabled={true}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonIcon}>
                <Text style={styles.buttonIconText}>🎧</Text>
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonTitle, styles.disabledText]}>
                  Help & Support
                </Text>
                <Text style={[styles.buttonSubtitle, styles.disabledText]}>
                  Get assistance from our team
                </Text>
              </View>
              <View style={styles.buttonArrow}>
                <Text style={[styles.arrowText, styles.disabledText]}>›</Text>
              </View>
            </View>
            <View style={styles.disabledOverlay}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
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
    paddingBottom: Spacing.xl * 2,
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  loadingCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
    minWidth: width * 0.7,
  },
  loadingIconContainer: {
    marginBottom: Spacing.lg,
  },
  loadingIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: Colors.primary,
    borderTopColor: Colors.secondary,
  },
  loadingText: {
    fontSize: FontSizes.large,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    letterSpacing: 0.5,
  },
  loadingBarContainer: {
    width: 200,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  loadingBar: {
    width: 80,
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
  },

  // Header Styles
  headerContainer: {
    height: height * 0.4,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    opacity: 0.95,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    zIndex: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatarGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.secondary,
    opacity: 0.3,
    top: -10,
    left: -10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 4,
    borderColor: Colors.secondary,
  },
  avatarText: {
    fontSize: FontSizes.xlarge * 2,
    fontWeight: '900',
    color: Colors.primary,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  libraryName: {
    fontSize: FontSizes.xlarge,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  adminName: {
    fontSize: FontSizes.medium,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: 0.5,
  },
  badgeContainer: {
    marginTop: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: '800',
    letterSpacing: 1,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Info Card Styles
  infoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xl * 2,
    borderRadius: Radius.xxl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 20,
    zIndex: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    overflow: 'hidden',
  },
  shimmerEffect: {
    width: 100,
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 0.6,
  },
  cardTitle: {
    fontSize: FontSizes.large,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  infoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconText: {
    fontSize: FontSizes.large,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
    marginLeft: 66,
  },

  // Actions Styles
  actionsContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    letterSpacing: 0.5,
  },
  actionButton: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  buttonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIconText: {
    fontSize: FontSizes.large * 1.2,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: FontSizes.medium,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs / 2,
    letterSpacing: 0.3,
  },
  buttonSubtitle: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  buttonArrow: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: FontSizes.xlarge,
    color: Colors.primary,
    fontWeight: '300',
  },
  disabledText: {
    color: Colors.disabled,
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderTopLeftRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
  },
  comingSoonText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: Spacing.xl * 2,
  },
});

export default ProfileScreen;
