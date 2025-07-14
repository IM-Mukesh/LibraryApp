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
