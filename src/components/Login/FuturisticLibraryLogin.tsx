// FuturisticLibraryLogin.tsx
import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../../redux/slices/authSlice';
import { setAuthToken } from '../../apis/api';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';
import { loginLibrary } from '../../apis/api';
import FloatingParticle from './FloatingParticle';
import PulsingOrb from './PulsingOrb';
import AnimatedInput from './AnimatedInput';
import HolographicButton from './HolographicButton';
import LoginHeader from './LoginHeader';
import { USER } from '../../redux/slices/authSlice';

const { width, height } = Dimensions.get('window');

const FuturisticLibraryLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { token, library } = await loginLibrary(email, password);
      setAuthToken(token);
      if (token && library) {
        dispatch(USER({ token, library, isLoggedIn: true }));
      }
      // dispatch(loginSuccess({ token, library }));
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Background with gradient effect */}
      <View style={styles.backgroundGradient} />

      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, index) => (
        <FloatingParticle key={index} delay={index * 500} />
      ))}

      {/* Pulsing orbs */}
      <PulsingOrb
        size={120}
        color={Colors.primary}
        duration={3000}
        style={{ top: height * 0.1, right: -20 }}
      />
      <PulsingOrb
        size={80}
        color={Colors.secondary}
        duration={2500}
        style={{ bottom: height * 0.2, left: -20 }}
      />
      <PulsingOrb
        size={60}
        color={Colors.primary}
        duration={2000}
        style={{ top: height * 0.3, left: width * 0.8 }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.glassCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>SECURE ACCESS</Text>
                <View style={styles.securityIndicator}>
                  <View style={styles.securityDot} />
                  <Text style={styles.securityText}>ENCRYPTED</Text>
                </View>
              </View>

              <View style={styles.formFields}>
                <AnimatedInput
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  icon="📧"
                />

                <AnimatedInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  icon="🔒"
                />

                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </View>

              <HolographicButton
                title="INITIALIZE ACCESS"
                onPress={handleLogin}
                loading={isLoading}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have access?{' '}
                <Text style={styles.footerLink}>Request Permission</Text>
              </Text>
              <Text style={styles.versionText}>v2.0.25 • Quantum Secured</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    opacity: 0.9,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: StatusBar.currentHeight || 0,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    minHeight: height * 0.9,
  },
  formContainer: {
    flex: 1,
  },
  glassCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  cardTitle: {
    fontSize: FontSizes.medium,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  securityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: Spacing.xs,
  },
  securityText: {
    fontSize: FontSizes.small,
    color: Colors.success,
    fontWeight: '600',
  },
  formFields: {
    marginBottom: Spacing.xl,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: FontSizes.small,
    fontWeight: '600',
    alignSelf: 'flex-end',
    marginTop: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.small,
    textAlign: 'center',
  },
  footerLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  versionText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.small - 2,
    marginTop: Spacing.sm,
    opacity: 0.7,
  },
});

export default FuturisticLibraryLogin;
