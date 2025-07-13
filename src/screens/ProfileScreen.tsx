// // ProfileScreen.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Colors, Spacing } from '../theme/theme';
import { ProfileScreenProps } from '../types/ProfileTypes';
import { useProfileAnimations } from '../hooks/useProfileAnimations';
import LoadingScreen from '../components/LoadingScreen';
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfoCard from '../components/ProfileInfoCard';
import ActionsContainer from '../components/ActionsContainer';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const library = useSelector((state: RootState) => state?.auth?.library);
  const animations = useProfileAnimations();

  const handleChangePassword = () => {
    navigation.navigate('changepassword');
  };

  const handleSupport = () => {
    // Support functionality - currently disabled
  };

  if (!library) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: animations.scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <ProfileHeader
          library={library}
          fadeAnim={animations.fadeAnim}
          headerSlideAnim={animations.headerSlideAnim}
          pulseAnim={animations.pulseAnim}
          floatAnim={animations.floatAnim}
          rotateAnim={animations.rotateAnim}
          scrollY={animations.scrollY}
        />
        <ProfileInfoCard
          library={library}
          fadeAnim={animations.fadeAnim}
          cardSlideAnim={animations.cardSlideAnim}
          shimmerAnim={animations.shimmerAnim}
        />
        <ActionsContainer
          fadeAnim={animations.fadeAnim}
          buttonScaleAnim={animations.buttonScaleAnim}
          onChangePassword={handleChangePassword}
          onSupport={handleSupport}
        />
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
  bottomSpacer: {
    height: Spacing.xl * 2,
  },
});

export default ProfileScreen;

// 'use client';

// import type React from 'react';
// import { useRef, useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   Dimensions,
//   StatusBar,
//   SafeAreaView,
// } from 'react-native';
// import { Colors, Spacing, FontSizes, Radius, Shadows } from '../theme/theme';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../redux/store';
// import ProfileAvatar from '../components/Avatar/ProfileAvatar';
// const { width, height } = Dimensions.get('window');

// // Types
// interface Library {
//   adminName: string;
//   name: string;
//   adminEmail: string;
//   adminPhone: string;
//   address: string;
//   profileImageUri?: string;
// }

// interface ProfileScreenProps {
//   navigation: any;
// }

// // Loading Screen Component (keeping existing implementation)
// const LoadingScreen: React.FC = () => {
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const shimmerAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Pulse animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.05,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//       ]),
//     ).start();

//     // Rotate animation
//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 20000,
//         useNativeDriver: true,
//       }),
//     ).start();

//     // Shimmer animation
//     Animated.loop(
//       Animated.timing(shimmerAnim, {
//         toValue: 1,
//         duration: 2000,
//         useNativeDriver: true,
//       }),
//     ).start();
//   }, []);

//   const rotateInterpolate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   const shimmerTranslate = shimmerAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-width, width],
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
//       <View style={styles.loadingContainer}>
//         <Animated.View
//           style={[styles.loadingCard, { transform: [{ scale: pulseAnim }] }]}
//         >
//           <View style={styles.loadingIconContainer}>
//             <Animated.View
//               style={[
//                 styles.loadingIcon,
//                 { transform: [{ rotate: rotateInterpolate }] },
//               ]}
//             />
//           </View>
//           <Text style={styles.loadingText}>Loading Your Profile</Text>
//           <View style={styles.loadingBarContainer}>
//             <Animated.View
//               style={[
//                 styles.loadingBar,
//                 { transform: [{ translateX: shimmerTranslate }] },
//               ]}
//             />
//           </View>
//         </Animated.View>
//       </View>
//     </SafeAreaView>
//   );
// };

// // Floating Particles Component (keeping existing implementation)
// interface FloatingParticlesProps {
//   floatAnim: Animated.Value;
//   rotateAnim: Animated.Value;
// }

// const FloatingParticles: React.FC<FloatingParticlesProps> = ({
//   floatAnim,
//   rotateAnim,
// }) => {
//   const rotateInterpolate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   return (
//     <View style={styles.particlesContainer}>
//       {[...Array(6)].map((_, i) => (
//         <Animated.View
//           key={i}
//           style={[
//             styles.particle,
//             {
//               left: `${15 + i * 15}%`,
//               top: `${20 + (i % 3) * 25}%`,
//               transform: [
//                 {
//                   translateY: floatAnim.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: [0, -15 - i * 3],
//                   }),
//                 },
//                 { rotate: rotateInterpolate },
//               ],
//             },
//           ]}
//         />
//       ))}
//     </View>
//   );
// };

// // Profile Header Component (updated to use new ProfileAvatar)
// interface ProfileHeaderProps {
//   library: Library;
//   fadeAnim: Animated.Value;
//   headerSlideAnim: Animated.Value;
//   pulseAnim: Animated.Value;
//   floatAnim: Animated.Value;
//   rotateAnim: Animated.Value;
//   scrollY: Animated.Value;
//   onImageUpload: (imageUri: string) => Promise<void>;
// }

// const ProfileHeader: React.FC<ProfileHeaderProps> = ({
//   library,
//   fadeAnim,
//   headerSlideAnim,
//   pulseAnim,
//   floatAnim,
//   rotateAnim,
//   scrollY,
//   onImageUpload,
// }) => {
//   const headerOpacity = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [1, 0.8],
//     extrapolate: 'clamp',
//   });

//   const headerScale = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [1, 0.95],
//     extrapolate: 'clamp',
//   });

//   return (
//     <Animated.View
//       style={[
//         styles.headerContainer,
//         {
//           opacity: headerOpacity,
//           transform: [{ translateY: headerSlideAnim }, { scale: headerScale }],
//         },
//       ]}
//     >
//       <View style={styles.gradientOverlay} />
//       <View style={styles.headerContent}>
//         <ProfileAvatar
//           name={library.adminName}
//           imageUri={library.profileImageUri}
//           size={120}
//           onImageUpload={onImageUpload}
//           showUploadButton={true}
//           showOnlineStatus={true}
//           editable={true}
//         />
//         <Animated.View
//           style={[styles.headerTextContainer, { opacity: fadeAnim }]}
//         >
//           <Text style={styles.libraryName}>{library.name.toUpperCase()}</Text>
//           <Text style={styles.adminName}>
//             Administrator: {library.adminName}
//           </Text>
//           <View style={styles.badgeContainer}>
//             <View style={styles.badge}>
//               <Text style={styles.badgeText}>PREMIUM</Text>
//             </View>
//           </View>
//         </Animated.View>
//       </View>
//       <FloatingParticles floatAnim={floatAnim} rotateAnim={rotateAnim} />
//     </Animated.View>
//   );
// };

// // Keep all other existing components (InfoRow, ProfileInfoCard, ActionButton, ActionsContainer)
// // ... (existing component implementations remain the same)

// // Custom Hook for Animations (keeping existing implementation)
// const useProfileAnimations = () => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(50)).current;
//   const scaleAnim = useRef(new Animated.Value(0.9)).current;
//   const headerSlideAnim = useRef(new Animated.Value(-100)).current;
//   const cardSlideAnim = useRef(new Animated.Value(100)).current;
//   const buttonScaleAnim = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const shimmerAnim = useRef(new Animated.Value(0)).current;
//   const floatAnim = useRef(new Animated.Value(0)).current;
//   const [scrollY] = useState(new Animated.Value(0));

//   useEffect(() => {
//     // Main entrance animation
//     Animated.stagger(150, [
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(headerSlideAnim, {
//         toValue: 0,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.timing(cardSlideAnim, {
//         toValue: 0,
//         duration: 700,
//         useNativeDriver: true,
//       }),
//       Animated.spring(buttonScaleAnim, {
//         toValue: 1,
//         tension: 50,
//         friction: 7,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Continuous animations
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.05,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//       ]),
//     ).start();

//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 20000,
//         useNativeDriver: true,
//       }),
//     ).start();

//     Animated.loop(
//       Animated.timing(shimmerAnim, {
//         toValue: 1,
//         duration: 2000,
//         useNativeDriver: true,
//       }),
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim, {
//           toValue: 1,
//           duration: 3000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim, {
//           toValue: 0,
//           duration: 3000,
//           useNativeDriver: true,
//         }),
//       ]),
//     ).start();
//   }, []);

//   return {
//     fadeAnim,
//     slideAnim,
//     scaleAnim,
//     headerSlideAnim,
//     cardSlideAnim,
//     buttonScaleAnim,
//     pulseAnim,
//     rotateAnim,
//     shimmerAnim,
//     floatAnim,
//     scrollY,
//   };
// };

// // Main Profile Screen Component (updated)
// const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const library = useSelector((state: RootState) => state?.auth?.library);
//   const animations = useProfileAnimations();

//   const handleImageUpload = async (imageUri: string): Promise<void> => {
//     try {
//       // Here you would typically upload to your server/cloud storage
//       // For now, we'll just update the local state
//       console.log('Uploading image:', imageUri);

//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       // Update Redux store with new image URI
//       // dispatch(updateProfileImage(imageUri));

//       console.log('Image uploaded successfully');
//     } catch (error) {
//       console.error('Failed to upload image:', error);
//       throw error;
//     }
//   };

//   const handleChangePassword = () => {
//     navigation.navigate('changepassword');
//   };

//   const handleSupport = () => {
//     // Support functionality - currently disabled
//   };

//   if (!library) {
//     return <LoadingScreen />;
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
//       <Animated.ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: animations.scrollY } } }],
//           {
//             useNativeDriver: false,
//           },
//         )}
//         scrollEventThrottle={16}
//       >
//         <ProfileHeader
//           library={library}
//           fadeAnim={animations.fadeAnim}
//           headerSlideAnim={animations.headerSlideAnim}
//           pulseAnim={animations.pulseAnim}
//           floatAnim={animations.floatAnim}
//           rotateAnim={animations.rotateAnim}
//           scrollY={animations.scrollY}
//           onImageUpload={handleImageUpload}
//         />

//         {/* Keep existing ProfileInfoCard and ActionsContainer components */}

//         <View style={styles.bottomSpacer} />
//       </Animated.ScrollView>
//     </SafeAreaView>
//   );
// };

// // Styles (keeping existing styles and adding new ones for avatar system)
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: Spacing.xl * 2,
//   },
//   // Loading Styles (keeping existing)
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.primary,
//   },
//   loadingCard: {
//     backgroundColor: Colors.white,
//     borderRadius: Radius.xxl,
//     paddingVertical: Spacing.xl * 2,
//     paddingHorizontal: Spacing.xl,
//     alignItems: 'center',
//     ...Shadows.card,
//     shadowOffset: { width: 0, height: 20 },
//     shadowOpacity: 0.3,
//     shadowRadius: 25,
//     elevation: 20,
//     minWidth: width * 0.7,
//   },
//   loadingIconContainer: {
//     marginBottom: Spacing.lg,
//   },
//   loadingIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     borderWidth: 4,
//     borderColor: Colors.primary,
//     borderTopColor: Colors.secondary,
//   },
//   loadingText: {
//     fontSize: FontSizes.large,
//     fontWeight: '700',
//     color: Colors.textPrimary,
//     marginBottom: Spacing.lg,
//     letterSpacing: 0.5,
//   },
//   loadingBarContainer: {
//     width: 200,
//     height: 4,
//     backgroundColor: Colors.border,
//     borderRadius: Radius.sm,
//     overflow: 'hidden',
//   },
//   loadingBar: {
//     width: 80,
//     height: '100%',
//     backgroundColor: Colors.primary,
//     borderRadius: Radius.sm,
//   },
//   // Header Styles (keeping existing)
//   headerContainer: {
//     height: height * 0.4,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   gradientOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: Colors.primary,
//     opacity: 0.95,
//   },
//   headerContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: Spacing.xl,
//     zIndex: 2,
//   },
//   headerTextContainer: {
//     alignItems: 'center',
//     marginTop: Spacing.lg,
//   },
//   libraryName: {
//     fontSize: FontSizes.xlarge,
//     fontWeight: '900',
//     color: Colors.white,
//     textAlign: 'center',
//     marginBottom: Spacing.xs,
//     letterSpacing: 1,
//     textShadowColor: 'rgba(0,0,0,0.3)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 5,
//   },
//   adminName: {
//     fontSize: FontSizes.medium,
//     color: 'rgba(255,255,255,0.9)',
//     textAlign: 'center',
//     marginBottom: Spacing.md,
//     letterSpacing: 0.5,
//   },
//   badgeContainer: {
//     marginTop: Spacing.sm,
//   },
//   badge: {
//     backgroundColor: Colors.secondary,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//     borderRadius: Radius.full,
//     ...Shadows.card,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   badgeText: {
//     color: Colors.white,
//     fontSize: FontSizes.small,
//     fontWeight: '800',
//     letterSpacing: 1,
//   },
//   particlesContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 1,
//   },
//   particle: {
//     position: 'absolute',
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//   },
//   bottomSpacer: {
//     height: Spacing.xl * 2,
//   },
// });

// export default ProfileScreen;
