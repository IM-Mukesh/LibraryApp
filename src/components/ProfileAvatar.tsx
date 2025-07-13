import React, { useState, useEffect } from 'react';
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
import {
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { setAuthToken } from '../apis/api';
import { Colors, Spacing, FontSizes, Shadows, Radius } from '../theme/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { uploadProfileImage } from '../apis/api';

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
}) => {
  const [currentImageUri, setCurrentImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [showUploadHint, setShowUploadHint] = useState(false);
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
    if (profileImageUrl && isValidUrl(profileImageUrl)) {
      setCurrentImageUri(profileImageUrl);
      setImageLoadError(false);
    } else {
      setCurrentImageUri(null);
      setImageLoadError(true);
    }
  }, [profileImageUrl]);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleImagePicker = (): void => {
    if (!isEditable) return;

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      includeBase64: false,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        if (response.errorMessage) {
          Alert.alert('Error', 'Failed to select image. Please try again.');
        }
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];

        if (asset.uri) {
          setIsLoading(true);
          setCurrentImageUri(asset.uri);

          // Callback for immediate UI update
          onImageSelected?.(asset.uri);

          // Prepare upload data
          const uploadData = {
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            name:
              asset.fileName || `profile_${userId || 'user'}_${Date.now()}.jpg`,
            size: asset.fileSize,
          };

          // Handle upload
          onImageUpload?.(uploadData);

          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      }
    });
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
                <Text style={styles.editIconText}>✏️</Text>
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
        {
          transform: [{ scale: pulseAnim }, { translateY: floatTranslate }],
        },
      ]}
      onPress={handleImagePicker}
      disabled={!isEditable}
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
      {isEditable && (
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
      )}

      {/* Status indicator - commented out */}
      {/* <View
        style={[
          styles.statusIndicator,
          {
            width: config.indicator,
            height: config.indicator,
            borderRadius: config.indicator / 2,
          },
        ]}
      /> */}

      {/* Upload hint */}
      {isEditable && showUploadHint && (
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
  uploadHint: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.button,
  },
  uploadHintText: {
    fontSize: FontSizes.medium,
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
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: Colors.success,
    borderWidth: 3,
    borderColor: Colors.white,
    ...Shadows.subtle,
  },
});

export default ProfileAvatar;
