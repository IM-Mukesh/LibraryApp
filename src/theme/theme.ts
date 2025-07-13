const Colors = {
  primary: '#2E86DE',
  secondary: '#48C9B0',
  background: '#F5F5F5',
  card: '#FFFFFF',
  border: '#E0E0E0',
  textPrimary: '#212121',
  textSecondary: '#757575',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  disabled: '#BDBDBD',
  white: '#FFFFFF',
  black: '#000000',
  neon: '#00F5FF',
  cardGradient: '#1E3A8A',
  surface: '#f2f2f2',
  gray: '#A0A0A0',
  // New colors for avatar system
  overlay: 'rgba(0, 0, 0, 0.5)',
  shimmer: 'rgba(255, 255, 255, 0.3)',
  avatarBorder: '#E8F4FD',
  uploadHover: '#1976D2',
};

const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

const FontSizes = {
  xs: 10,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  xxxlarge: 48,
};

const Radius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  full: 9999,
};

const Shadows = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // New shadows for avatar system
  avatar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  overlay: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
};

export { Colors, Spacing, FontSizes, Radius, Shadows };
