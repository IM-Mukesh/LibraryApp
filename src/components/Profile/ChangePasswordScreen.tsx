// src/screens/ChangePasswordScreen.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import HeaderBack from '../BackButton';
import { Colors, Spacing, FontSizes, Radius, Shadows } from '../../theme/theme';
import { changePassword, setAuthToken } from '../../apis/api';
import { useHideTabBarOnKeyboard } from '../../hooks/useHideTabBarOnKeyboard';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

// Eye icons as SVG paths - no external dependencies
const EyeIcon = ({
  isVisible,
  onToggle,
}: {
  isVisible: boolean;
  onToggle: () => void;
}) => (
  <TouchableOpacity
    onPress={onToggle}
    style={styles.eyeIcon}
    activeOpacity={0.7}
  >
    <View style={styles.eyeIconContainer}>
      {isVisible ? (
        // Open eye icon
        <Text style={styles.eyeText}>👁️</Text>
      ) : (
        // Closed eye icon
        <Text style={styles.eyeText}>👁️‍🗨️</Text>
      )}
    </View>
  </TouchableOpacity>
);

// Password strength indicator
const PasswordStrength = ({ password }: { password: string }) => {
  const strength = useMemo(() => {
    if (!password) return { level: 0, text: '', color: Colors.disabled };

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { level: 1, text: 'Weak', color: Colors.error };
    if (score <= 4) return { level: 2, text: 'Medium', color: Colors.warning };
    return { level: 3, text: 'Strong', color: Colors.success };
  }, [password]);

  if (!password) return null;

  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthBarContainer}>
        <View
          style={[
            styles.strengthBar,
            {
              width: `${(strength.level / 3) * 100}%`,
              backgroundColor: strength.color,
            },
          ]}
        />
      </View>
      <Text style={[styles.strengthText, { color: strength.color }]}>
        {strength.text}
      </Text>
    </View>
  );
};

// Custom Input Component
const PasswordInput = ({
  value,
  onChangeText,
  placeholder,
  showPassword,
  onTogglePassword,
  hasError = false,
  errorMessage = '',
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  hasError?: boolean;
  errorMessage?: string;
}) => (
  <View style={styles.inputContainer}>
    <View style={[styles.inputWrapper, hasError && styles.inputError]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        secureTextEntry={!showPassword}
        autoCorrect={false}
        autoCapitalize="none"
        textContentType="password"
      />
      <EyeIcon isVisible={showPassword} onToggle={onTogglePassword} />
    </View>
    {hasError && errorMessage && (
      <Text style={styles.errorText}>{errorMessage}</Text>
    )}
  </View>
);

const ChangePasswordScreen = ({ navigation }: any) => {
  useHideTabBarOnKeyboard(navigation);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { token } = useSelector((state: RootState) => state?.auth);

  const spinAnim = useMemo(() => new Animated.Value(0), []);

  const triggerSpin = useCallback(() => {
    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [spinAnim]);

  // Validation logic
  const validateForm = useCallback(() => {
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    // Old password validation
    if (!oldPassword.trim()) {
      newErrors.oldPassword = 'Current password is required';
    }

    // New password validation
    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  }, [oldPassword, newPassword, confirmPassword]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      oldPassword.trim() !== '' &&
      newPassword.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      newPassword.length >= 6 &&
      newPassword === confirmPassword
    );
  }, [oldPassword, newPassword, confirmPassword]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    triggerSpin();

    try {
      setAuthToken(token);
      const res = await changePassword({ oldPassword, newPassword });

      Alert.alert('Success', res.message, [
        {
          text: 'OK',
          onPress: () => {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setErrors({
              oldPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'An error occurred while changing password',
      );
    } finally {
      setLoading(false);
    }
  }, [validateForm, triggerSpin, token, oldPassword, newPassword]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      <HeaderBack />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>
              Please enter your current password and choose a new secure
              password
            </Text>
          </View>

          <View style={styles.formContainer}>
            <PasswordInput
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Current Password"
              showPassword={showOldPassword}
              onTogglePassword={() => setShowOldPassword(!showOldPassword)}
              hasError={!!errors.oldPassword}
              errorMessage={errors.oldPassword}
            />

            <PasswordInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              showPassword={showNewPassword}
              onTogglePassword={() => setShowNewPassword(!showNewPassword)}
              hasError={!!errors.newPassword}
              errorMessage={errors.newPassword}
            />

            <PasswordStrength password={newPassword} />

            <PasswordInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              hasError={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
            />

            <TouchableOpacity
              style={[
                styles.button,
                (!isFormValid || loading) && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Text style={styles.buttonText}>🔄</Text>
                </Animated.View>
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    (!isFormValid || loading) && styles.buttonTextDisabled,
                  ]}
                >
                  Update Password
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSizes.xxlarge,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  inputError: {
    borderColor: Colors.error,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
  },
  eyeIcon: {
    padding: Spacing.sm,
  },
  eyeIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeText: {
    fontSize: 18,
    opacity: 0.7,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.small,
    marginTop: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  strengthContainer: {
    marginTop: -Spacing.md,
    marginBottom: Spacing.md,
  },
  strengthBarContainer: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: Radius.xs,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  strengthBar: {
    height: '100%',
    borderRadius: Radius.xs,
  },
  strengthText: {
    fontSize: FontSizes.small,
    fontWeight: '600',
    textAlign: 'right',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    minHeight: 52,
    ...Shadows.button,
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
    ...Shadows.subtle,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FontSizes.medium,
    letterSpacing: 0.5,
  },
  buttonTextDisabled: {
    color: Colors.textSecondary,
  },
});

export default ChangePasswordScreen;
