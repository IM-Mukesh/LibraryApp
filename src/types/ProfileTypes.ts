export interface Library {
  adminName: string;
  name: string;
  adminEmail: string;
  adminPhone: string;
  address: string;
}

export interface ProfileScreenProps {
  navigation: any;
}

export interface ProfileAvatarProps {
  name: string;
  pulseAnim: any;
  floatAnim: any;
}

export interface FloatingParticlesProps {
  floatAnim: any;
  rotateAnim: any;
}

export interface ProfileHeaderProps {
  library: Library;
  fadeAnim: any;
  headerSlideAnim: any;
  pulseAnim: any;
  floatAnim: any;
  rotateAnim: any;
  scrollY: any;
}

export interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  isLast?: boolean;
}

export interface ProfileInfoCardProps {
  library: Library;
  fadeAnim: any;
  cardSlideAnim: any;
  shimmerAnim: any;
}

export interface ActionButtonProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  disabled?: boolean;
  showComingSoon?: boolean;
}

export interface ActionsContainerProps {
  fadeAnim: any;
  buttonScaleAnim: any;
  onChangePassword: () => void;
  onSupport: () => void;
}
