'use client';

import type React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../../apis/api';
import { Colors, Spacing, FontSizes, Radius, Shadows } from '../../theme/theme';
import { loginLibrary } from '../../apis/api';
import FloatingParticle from './FloatingParticle';
import PulsingOrb from './PulsingOrb';
import LoginHeader from './LoginHeader';
import { USER } from '../../redux/slices/authSlice';

const { width, height } = Dimensions.get('window');

// Local theme colors for this page only
const LoginTheme = {
  background: '#FAFAFA',
  cardBackground: '#FFFFFF',
  inputBackground: '#F8F9FA',
  inputBorder: '#E1E5E9',
  inputFocusBorder: Colors.primary,
  accent: Colors.primary,
  success: '#10B981',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  overlayBackground: 'rgba(255, 255, 255, 0.95)',
};

interface AnimatedInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  showPasswordToggle = false,
  onTogglePassword,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.timing(borderColorAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, borderColorAnim, labelAnim]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [LoginTheme.inputBorder, LoginTheme.inputFocusBorder],
  });

  const labelStyle = {
    position: 'absolute' as const,
    left: 16,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [15, -8],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [FontSizes.medium, FontSizes.small],
    }),
    color: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [LoginTheme.textMuted, LoginTheme.accent],
    }),
    backgroundColor:
      isFocused || value ? LoginTheme.cardBackground : 'transparent',
    paddingHorizontal: isFocused || value ? 6 : 0,
    fontWeight: '500' as const,
    zIndex: 1,
  };

  return (
    <View style={styles.inputWrapper}>
      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholderTextColor="transparent"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType={keyboardType === 'email-address' ? 'next' : 'done'}
          blurOnSubmit={false}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={onTogglePassword}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Text style={styles.passwordToggleIcon}>
              {secureTextEntry ? '👁️' : '🙈'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
      <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
    </View>
  );
};

const ModernButton: React.FC<{
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}> = ({ title, onPress, loading = false, disabled = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    if (disabled || loading) return;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [disabled, loading, scaleAnim, opacityAnim]);

  const handlePressOut = useCallback(() => {
    if (disabled || loading) return;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [disabled, loading, scaleAnim, opacityAnim]);

  return (
    <TouchableOpacity
      style={[
        styles.modernButton,
        loading && styles.modernButtonLoading,
        disabled && styles.modernButtonDisabled,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={loading || disabled}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.modernButtonContent,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Animated.View
              style={[
                styles.loadingSpinner,
                {
                  transform: [
                    {
                      rotate: new Animated.Value(0).interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Text style={styles.modernButtonText}>Authenticating...</Text>
          </View>
        ) : (
          <Text
            style={[
              styles.modernButtonText,
              disabled && styles.modernButtonTextDisabled,
            ]}
          >
            {title}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const FuturisticLibraryLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const dispatch = useDispatch();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if email is valid and password has minimum 4 characters
  const isFormValid = emailRegex.test(email.trim()) && password.length >= 4;

  useEffect(() => {
    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false),
    );

    // Initial animations
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Cleanup
    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, [fadeInAnim, slideUpAnim]);

  const handleLogin = useCallback(async () => {
    if (!isFormValid) return;

    // Dismiss keyboard before starting login process
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const { token, library } = await loginLibrary(email, password);
      setAuthToken(token);

      if (token && library) {
        dispatch(USER({ token, library, isLoggedIn: true }));
      }
    } catch (error: any) {
      Alert.alert(
        'Authentication Failed',
        error.message || 'Invalid credentials',
        [{ text: 'OK', style: 'default' }],
      );
    } finally {
      setIsLoading(false);
    }
  }, [email, password, isFormValid, dispatch]);

  const dismissKeyboard = useCallback(() => {
    // Only dismiss keyboard if it's visible and user taps outside input areas
    if (keyboardVisible) {
      Keyboard.dismiss();
    }
  }, [keyboardVisible]);

  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Light background with subtle gradient */}
      <View style={styles.backgroundGradient} />

      {/* Minimal floating particles */}
      {Array.from({ length: 8 }).map((_, index) => (
        <FloatingParticle key={index} delay={index * 800} />
      ))}

      {/* Subtle accent orbs */}
      <PulsingOrb
        size={100}
        color={Colors.primary}
        duration={4000}
        style={{ top: height * 0.15, right: -30, opacity: 0.1 }}
      />
      <PulsingOrb
        size={60}
        color={Colors.secondary}
        duration={3500}
        style={{ bottom: height * 0.25, left: -20, opacity: 0.1 }}
      />

      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Animated.View
            style={[
              styles.mainContent,
              {
                opacity: fadeInAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <LoginHeader />

            <View style={styles.formContainer}>
              <View style={styles.loginCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Welcome Back</Text>
                  <Text style={styles.cardSubtitle}>
                    Sign in to your account
                  </Text>
                </View>

                <View style={styles.formFields}>
                  <AnimatedInput
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                  />
                  <AnimatedInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    showPasswordToggle={true}
                    onTogglePassword={handleTogglePassword}
                  />
                </View>

                <ModernButton
                  title="Sign In"
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={!isFormValid}
                />

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Secure authentication powered by advanced encryption
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LoginTheme.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: LoginTheme.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: (StatusBar.currentHeight || 0) + 20,
    paddingBottom: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    minHeight: height * 0.85,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loginCard: {
    backgroundColor: LoginTheme.cardBackground,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.sm,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: LoginTheme.glassBorder,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  cardTitle: {
    fontSize: FontSizes.xxlarge,
    fontWeight: '700',
    color: LoginTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: FontSizes.medium,
    color: LoginTheme.textSecondary,
    fontWeight: '400',
  },
  formFields: {
    marginBottom: Spacing.xl,
  },
  inputWrapper: {
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  inputContainer: {
    backgroundColor: LoginTheme.inputBackground,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    height: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.subtle,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: FontSizes.medium,
    color: LoginTheme.textPrimary,
    paddingRight: 40,
    fontWeight: '500',
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  passwordToggleIcon: {
    fontSize: 16,
  },
  modernButton: {
    height: 52,
    borderRadius: Radius.lg,
    backgroundColor: LoginTheme.accent,
    ...Shadows.button,
    overflow: 'hidden',
  },
  modernButtonLoading: {
    backgroundColor: LoginTheme.textMuted,
  },
  modernButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  modernButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  modernButtonTextDisabled: {
    color: Colors.white,
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.white,
    borderTopColor: 'transparent',
    marginRight: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: LoginTheme.inputBorder,
  },
  footerText: {
    fontSize: FontSizes.small,
    color: LoginTheme.textMuted,
    textAlign: 'center',
    fontWeight: '400',
  },
});

export default FuturisticLibraryLogin;
