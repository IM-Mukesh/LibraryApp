import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import {
  setAuthToken,
  registerLibrary,
  RegisterLibraryPayload,
} from '../../apis/api';
import { Colors, Spacing, FontSizes, Radius, Shadows } from '../../theme/theme';
import FloatingParticle from './FloatingParticle';
import PulsingOrb from './PulsingOrb';
import LoginHeader from './LoginHeader';
import { USER } from '../../redux/slices/authSlice';
import { AnimatedInput } from '../ui/AnimatedInput';
import HolographicButton from './HolographicButton';
import { SvgXml } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const RegisterTheme = {
  ...Colors,
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
  keyboardType?: 'email-address' | 'default' | 'phone-pad';
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}

// Remove any local AnimatedInput definition or import from './AnimatedInput'. Only use the exported AnimatedInput from '../ui/AnimatedInput'.
// Ensure all usages of AnimatedInput use the correct import and prop signature.

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
            <Text style={styles.modernButtonText}>Registering...</Text>
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

// OTPInput component for 6-digit OTP
type OTPInputProps = {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  onResend: () => void;
  label: string;
};
const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  error,
  onResend,
  label,
}) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontWeight: '600',
          color: Colors.textPrimary,
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[...Array(6)].map((_, i) => (
          <TextInput
            key={i}
            value={value[i] || ''}
            onChangeText={text => {
              if (/^\d?$/.test(text)) {
                const arr = value.split('');
                arr[i] = text;
                onChange(arr.join('').slice(0, 6));
              }
            }}
            maxLength={1}
            keyboardType="number-pad"
            style={{
              width: 40,
              height: 48,
              borderWidth: 1.5,
              borderColor: error ? Colors.error : Colors.primary,
              borderRadius: 8,
              textAlign: 'center',
              fontSize: 22,
              color: Colors.textPrimary,
              backgroundColor: Colors.white,
            }}
            autoFocus={i === 0}
          />
        ))}
      </View>
      {error && (
        <Text style={{ color: Colors.error, marginTop: 4 }}>{error}</Text>
      )}
      <TouchableOpacity onPress={onResend} style={{ marginTop: 8 }}>
        <Text style={{ color: Colors.primary, fontWeight: '600' }}>
          Resend OTP
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Add Google SVG icon (inline or as a local asset)
const googleSvgXml = `
<svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <g>
    <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C33.5 5.1 28.1 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-8.1 20-21 0-1.3-.1-2.7-.3-4z"/>
    <path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c2.7 0 5.2.9 7.2 2.5l6.4-6.4C33.5 5.1 28.1 3 24 3c-7.2 0-13.4 4.1-16.7 10.1z"/>
    <path fill="#FBBC05" d="M24 45c5.8 0 10.7-1.9 14.3-5.1l-6.6-5.4C29.7 36.1 27 37 24 37c-5.7 0-10.5-3.9-12.2-9.1l-7 5.4C7.1 41.1 14.9 45 24 45z"/>
    <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-2.7 0-5.2-.9-7.2-2.5l-6.4 6.4C14.5 42.9 19.9 45 24 45c10.5 0 20-8.1 20-21 0-1.3-.1-2.7-.3-4z"/>
  </g>
</svg>
`;

const GoogleLogo = () => (
  <SvgXml
    xml={googleSvgXml}
    width={22}
    height={22}
    style={{ marginRight: 8 }}
  />
);

// InlineButton for OTP/Verify
type InlineButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};
const InlineButton: React.FC<InlineButtonProps> = ({
  title,
  onPress,
  disabled = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={{
      backgroundColor: Colors.white,
      borderColor: Colors.primary,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginLeft: 8,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: Colors.primary,
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    }}
    activeOpacity={0.85}
  >
    <Text style={{ color: Colors.primary, fontWeight: '600', fontSize: 15 }}>
      {title}
    </Text>
  </TouchableOpacity>
);

const FuturisticLibraryRegister: React.FC<{ navigation?: any }> = ({
  navigation,
}) => {
  // Form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP state
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [emailOTPSent, setEmailOTPSent] = useState(false);
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [emailOTPError, setEmailOTPError] = useState('');
  const [phoneOTPError, setPhoneOTPError] = useState('');
  const [emailOTPValidated, setEmailOTPValidated] = useState(false);
  const [phoneOTPValidated, setPhoneOTPValidated] = useState(false);

  // Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const canSendEmailOTP = emailRegex.test(adminEmail);
  const canSendPhoneOTP = phoneRegex.test(adminPhone);
  const canRegister =
    name.trim().length > 2 &&
    address.trim().length > 4 &&
    adminName.trim().length > 2 &&
    emailOTPValidated &&
    phoneOTPValidated &&
    password.length >= 6 &&
    password === confirmPassword;

  // OTP send/validate handlers (mocked for now)
  const handleSendEmailOTP = () => {
    setEmailOTPSent(true);
    setEmailOTP('');
    setEmailOTPError('');
    setEmailOTPValidated(false);
    // TODO: Call backend to send OTP
  };
  const handleSendPhoneOTP = () => {
    setPhoneOTPSent(true);
    setPhoneOTP('');
    setPhoneOTPError('');
    setPhoneOTPValidated(false);
    // TODO: Call backend to send OTP
  };
  const handleValidateEmailOTP = () => {
    if (emailOTP.length === 6) {
      setEmailOTPValidated(true);
      setEmailOTPError('');
    } else {
      setEmailOTPError('Invalid OTP');
    }
  };
  const handleValidatePhoneOTP = () => {
    if (phoneOTP.length === 6) {
      setPhoneOTPValidated(true);
      setPhoneOTPError('');
    } else {
      setPhoneOTPError('Invalid OTP');
    }
  };

  // Registration handler (mocked)
  const handleRegister = async () => {
    if (!canRegister) return;
    setIsLoading(true);
    // TODO: Call backend to register
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Registered!', 'Your library has been created.');
      navigation?.navigate?.('Login');
    }, 1500);
  };

  // Google sign up handler (mocked)
  const handleGoogleSignUp = () => {
    // TODO: Integrate Google sign-in
    Alert.alert('Google Sign Up', 'Google sign-in not yet implemented.');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: RegisterTheme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity
            onPress={handleGoogleSignUp}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.white,
              borderColor: Colors.border,
              borderWidth: 1.5,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 24,
              shadowColor: Colors.black,
              shadowOpacity: 0.04,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
              width: '100%',
              justifyContent: 'center',
            }}
            activeOpacity={0.85}
          >
            <GoogleLogo />
            <Text
              style={{
                color: Colors.textPrimary,
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              Sign up with Google
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: RegisterTheme.textMuted,
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            or fill the form below
          </Text>
        </View>
        <AnimatedInput
          label="Library Name"
          value={name}
          onChangeText={setName}
          required
        />
        <AnimatedInput
          label="Library Address"
          value={address}
          onChangeText={setAddress}
          required
        />
        <AnimatedInput
          label="Admin Name"
          value={adminName}
          onChangeText={setAdminName}
          required
        />
        {/* Email row with inline button */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <AnimatedInput
              label="Admin Email"
              value={adminEmail}
              onChangeText={setAdminEmail}
              keyboardType="email-address"
              required
            />
          </View>
          {!emailOTPValidated && canSendEmailOTP && (
            <InlineButton
              title={emailOTPSent ? 'Resend OTP' : 'Verify'}
              onPress={handleSendEmailOTP}
            />
          )}
        </View>
        {emailOTPSent && !emailOTPValidated && (
          <OTPInput
            value={emailOTP}
            onChange={setEmailOTP}
            error={emailOTPError}
            onResend={handleSendEmailOTP}
            label="Enter Email OTP"
          />
        )}
        {emailOTPValidated && (
          <Text style={{ color: Colors.success, marginBottom: 8 }}>
            Email verified ✓
          </Text>
        )}
        {/* Phone row with inline button */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <AnimatedInput
              label="Admin Phone"
              value={adminPhone}
              onChangeText={setAdminPhone}
              keyboardType="phone-pad"
              required
            />
          </View>
          {!phoneOTPValidated && canSendPhoneOTP && (
            <InlineButton
              title={phoneOTPSent ? 'Resend OTP' : 'Verify'}
              onPress={handleSendPhoneOTP}
            />
          )}
        </View>
        {phoneOTPSent && !phoneOTPValidated && (
          <OTPInput
            value={phoneOTP}
            onChange={setPhoneOTP}
            error={phoneOTPError}
            onResend={handleSendPhoneOTP}
            label="Enter Phone OTP"
          />
        )}
        {phoneOTPValidated && (
          <Text style={{ color: Colors.success, marginBottom: 8 }}>
            Phone verified ✓
          </Text>
        )}
        <AnimatedInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          required
          icon={
            <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
              <Text>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          }
        />
        <AnimatedInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          required
          icon={
            <TouchableOpacity onPress={() => setShowConfirmPassword(p => !p)}>
              <Text>{showConfirmPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          }
        />
        <HolographicButton
          title="Register"
          onPress={handleRegister}
          loading={isLoading}
        />
        <TouchableOpacity
          style={{ marginTop: 24, alignItems: 'center' }}
          onPress={() => navigation?.goBack?.()}
          activeOpacity={0.7}
        >
          <Text style={{ color: Colors.primary, fontWeight: '600' }}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RegisterTheme.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: RegisterTheme.background,
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
    backgroundColor: RegisterTheme.cardBackground,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.sm,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: RegisterTheme.glassBorder,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  cardTitle: {
    fontSize: FontSizes.xxlarge,
    fontWeight: '700',
    color: RegisterTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: FontSizes.medium,
    color: RegisterTheme.textSecondary,
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
    backgroundColor: RegisterTheme.inputBackground,
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
    color: RegisterTheme.textPrimary,
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
    backgroundColor: RegisterTheme.accent,
    ...Shadows.button,
    overflow: 'hidden',
  },
  modernButtonLoading: {
    backgroundColor: RegisterTheme.textMuted,
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
    borderTopColor: RegisterTheme.inputBorder,
  },
  footerText: {
    fontSize: FontSizes.small,
    color: RegisterTheme.textMuted,
    textAlign: 'center',
    fontWeight: '400',
  },
  stepContent: {
    marginBottom: Spacing.xl,
  },
  stepTitle: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    color: RegisterTheme.textPrimary,
    marginBottom: Spacing.md,
  },
  stepSubtitle: {
    fontSize: FontSizes.medium,
    color: RegisterTheme.textSecondary,
    marginBottom: Spacing.lg,
  },
  orDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  orDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: RegisterTheme.textMuted,
    opacity: 0.3,
  },
  orDividerText: {
    marginHorizontal: Spacing.sm,
    fontSize: FontSizes.medium,
    color: RegisterTheme.textMuted,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    ...Shadows.subtle,
  },
  googleButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: RegisterTheme.textPrimary,
    marginLeft: Spacing.sm,
  },
  reviewCard: {
    backgroundColor: RegisterTheme.inputBackground,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    ...Shadows.subtle,
  },
  reviewGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  reviewIcon: {
    marginRight: Spacing.sm,
  },
  reviewLabel: {
    fontSize: FontSizes.medium,
    color: RegisterTheme.textSecondary,
    fontWeight: '400',
  },
  reviewValue: {
    fontSize: FontSizes.medium,
    color: RegisterTheme.textPrimary,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: RegisterTheme.inputBorder,
    borderRadius: 4,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: RegisterTheme.accent,
    borderRadius: 4,
  },
});

export default FuturisticLibraryRegister;
