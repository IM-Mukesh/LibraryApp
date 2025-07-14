import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Colors, Spacing, FontSizes, Shadows, Radius } from '../theme/theme';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { uploadProfileImage } from '../apis/api';
import { updateProfileImage } from '../redux/slices/authSlice';

interface ProfileAvatarProps {
  name: string;
  pulseAnim: Animated.Value;
  floatAnim: Animated.Value;
  profileImageUrl?: string;
  onImageSelected?: (imageUri: string) => void;
  onImageUpload?: (imageData: any) => void;
  isEditable?: boolean;
  size?: 'small' | 'medium' | 'large';
  userId?: string;
  studentId?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  name,
  pulseAnim,
  floatAnim,
  profileImageUrl,
  onImageSelected,
  onImageUpload,
  isEditable = true,
  size = 'large',
  userId,
  studentId,
}) => {
  const [currentImageUri, setCurrentImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [showUploadHint, setShowUploadHint] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const profileImage = useSelector(
    (state: RootState) => state?.auth?.library?.profileImage,
  );

  const sizeConfig = {
    small: { avatar: 60, glow: 80, text: FontSizes.large, indicator: 20 },
    medium: { avatar: 90, glow: 110, text: FontSizes.xlarge, indicator: 26 },
    large: {
      avatar: 120,
      glow: 140,
      text: FontSizes.xlarge * 2,
      indicator: 32,
    },
  };

  const config = sizeConfig[size];

  useEffect(() => {
    // Priority: profileImage from Redux > profileImageUrl prop > null
    const imageToDisplay = profileImage || profileImageUrl;

    if (imageToDisplay && isValidUrl(imageToDisplay)) {
      setCurrentImageUri(imageToDisplay);
      setImageLoadError(false);
    } else {
      setCurrentImageUri(null);
      setImageLoadError(true);
    }
  }, [profileImage, profileImageUrl]);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      // Check if it's a local file URI
      return url.startsWith('file://') || url.startsWith('content://');
    }
  };

  // Removed showImagePickerOptions function - no longer needed

  // Commented out camera function
  // const openCamera = () => {
  //   ImagePicker.openCamera({
  //     width: 400,
  //     height: 400,
  //     cropping: true,
  //     cropperCircleOverlay: true,
  //     compressImageMaxWidth: 400,
  //     compressImageMaxHeight: 400,
  //     compressImageQuality: 0.8,
  //     mediaType: 'photo',
  //     includeBase64: false,
  //     enableRotationGesture: true,
  //     cropperToolbarTitle: 'Edit Profile Picture',
  //     cropperActiveWidgetColor: Colors.primary,
  //     cropperStatusBarColor: Colors.primary,
  //     cropperToolbarColor: Colors.primary,
  //     cropperToolbarWidgetColor: Colors.white,
  //   })
  //     .then(handleImageResult)
  //     .catch(handleImageError);
  // };

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      compressImageMaxWidth: 400,
      compressImageMaxHeight: 400,
      compressImageQuality: 0.8,
      mediaType: 'photo',
      includeBase64: false,
      enableRotationGesture: true,
      cropperToolbarTitle: 'Edit Profile Picture',
      cropperActiveWidgetColor: Colors.primary,
      cropperStatusBarColor: Colors.primary,
      cropperToolbarColor: Colors.primary,
      cropperToolbarWidgetColor: Colors.white,
    })
      .then(handleImageResult)
      .catch(handleImageError);
  };

  const handleImageResult = async (image: any) => {
    try {
      setIsLoading(true);
      setUploadProgress(0);

      // Update UI immediately with the cropped image
      setCurrentImageUri(image.path);
      setImageLoadError(false);
      onImageSelected?.(image.path);

      // Prepare upload data
      const uploadData = {
        uri: image.path,
        type: image.mime || 'image/jpeg',
        name: `profile_${userId || studentId || 'user'}_${Date.now()}.jpg`,
      };

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload the image
      const response = await uploadProfileImage(uploadData, studentId);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        // Append cache-busting timestamp
        const imageUrlWithTimestamp = `${response.imageUrl}?t=${Date.now()}`;
        dispatch(updateProfileImage(imageUrlWithTimestamp));
        setCurrentImageUri(imageUrlWithTimestamp);
        onImageUpload?.(response);

        Alert.alert('Success', 'Profile picture updated successfully!');
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert(
        'Upload Failed',
        error.message || 'Failed to upload profile picture. Please try again.',
      );
      // Revert to previous image on error
      setCurrentImageUri(profileImage || profileImageUrl || null);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleImageError = (error: any) => {
    if (error.code !== 'E_PICKER_CANCELLED') {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleImageLoadError = (): void => {
    setImageLoadError(true);
    setCurrentImageUri(null);
  };

  const handleImageLoadSuccess = (): void => {
    setImageLoadError(false);
  };

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const getInitials = (): string => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const renderProgressBar = () => {
    if (!isLoading || uploadProgress === 0) return null;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progressFill, { width: `${uploadProgress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{uploadProgress}%</Text>
      </View>
    );
  };

  const renderAvatarContent = () => {
    if (isLoading) {
      return (
        <View
          style={[
            styles.avatar,
            {
              width: config.avatar,
              height: config.avatar,
              borderRadius: config.avatar / 2,
            },
          ]}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
          {renderProgressBar()}
        </View>
      );
    }

    if (currentImageUri && !imageLoadError) {
      return (
        <View
          style={[
            styles.imageContainer,
            {
              width: config.avatar,
              height: config.avatar,
              borderRadius: config.avatar / 2,
            },
          ]}
        >
          <Image
            source={{ uri: currentImageUri }}
            style={[
              styles.profileImage,
              {
                width: config.avatar,
                height: config.avatar,
                borderRadius: config.avatar / 2,
              },
            ]}
            onError={handleImageLoadError}
            onLoad={handleImageLoadSuccess}
            resizeMode="cover"
          />
          {isEditable && (
            <View style={styles.editOverlay}>
              <View style={styles.editIcon}>
                <Text style={styles.editIconText}>📷</Text>
              </View>
            </View>
          )}
        </View>
      );
    }

    return (
      <View
        style={[
          styles.avatar,
          {
            width: config.avatar,
            height: config.avatar,
            borderRadius: config.avatar / 2,
          },
        ]}
      >
        <View style={styles.defaultAvatarContainer}>
          <Text style={[styles.avatarText, { fontSize: config.text }]}>
            {getInitials()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.avatarContainer,
        // {
        //   transform: [{ scale: pulseAnim }, { translateY: floatTranslate }],
        // },
      ]}
      // Directly call openGallery instead of showImagePickerOptions
      onPress={isEditable ? openGallery : undefined}
      disabled={!isEditable || isLoading}
      onPressIn={() => setShowUploadHint(true)}
      onPressOut={() => setShowUploadHint(false)}
      activeOpacity={isEditable ? 0.8 : 1}
    >
      {/* Glow effect */}
      <Animated.View
        style={[
          styles.avatarGlow,
          {
            width: config.glow,
            height: config.glow,
            borderRadius: config.glow / 2,
            opacity: showUploadHint && isEditable ? 0.5 : 0.3,
          },
        ]}
      />

      {/* Avatar content */}
      {renderAvatarContent()}

      {/* Camera icon indicator */}
      {/* {isEditable && !isLoading && (
        <View
          style={[
            styles.cameraIndicator,
            {
              width: config.indicator,
              height: config.indicator,
              borderRadius: config.indicator / 2,
            },
          ]}
        >
          <Text
            style={[styles.cameraIcon, { fontSize: config.indicator * 0.5 }]}
          >
            📷
          </Text>
        </View>
      )} */}

      {/* Upload hint */}
      {isEditable && showUploadHint && !isLoading && (
        <View style={styles.uploadHintOverlay}>
          <Text style={styles.uploadHintOverlayText}>Tap to change</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGlow: {
    position: 'absolute',
    backgroundColor: Colors.secondary,
    top: -10,
    left: -10,
  },
  avatar: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.avatar,
    borderWidth: 4,
    borderColor: Colors.avatarBorder,
    position: 'relative',
    overflow: 'hidden',
  },
  imageContainer: {
    ...Shadows.avatar,
    borderWidth: 4,
    borderColor: Colors.avatarBorder,
    position: 'relative',
    overflow: 'hidden',
  },
  profileImage: {
    backgroundColor: Colors.surface,
  },
  defaultAvatarContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  avatarText: {
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 2,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.overlay,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  editIconText: {
    fontSize: FontSizes.small,
  },
  uploadHintOverlay: {
    position: 'absolute',
    bottom: -40,
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    ...Shadows.card,
  },
  uploadHintOverlayText: {
    color: Colors.white,
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  cameraIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.avatarBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  cameraIcon: {
    color: Colors.primary,
    fontWeight: '600',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
  },
  progressText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default ProfileAvatar;
