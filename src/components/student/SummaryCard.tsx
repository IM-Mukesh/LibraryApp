import type React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface SummaryCardProps {
  title: string;
  icon: string;
  data: Array<{ label: string; value: string }>;
  onEdit: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  icon,
  data,
  onEdit,
}) => {
  const scale = useSharedValue(1);
  const editButtonScale = useSharedValue(1);

  const handleCardPressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
  };

  const handleCardPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handleEditPressIn = () => {
    editButtonScale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handleEditPressOut = () => {
    editButtonScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const editButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: editButtonScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, cardAnimatedStyle]}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {data.map((item, index) => (
            <View key={index} style={styles.dataRow}>
              <Text style={styles.label}>{item.label}:</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <Animated.View
        style={[styles.editButtonContainer, editButtonAnimatedStyle]}
      >
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
          onPressIn={handleEditPressIn}
          onPressOut={handleEditPressOut}
          activeOpacity={0.8}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.xs,
  },
  cardContent: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  content: {
    padding: Spacing.md,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  editButtonContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 2,
    borderColor: Colors.white,
    minWidth: 50,
  },
  editButtonText: {
    fontSize: FontSizes.small,
    color: Colors.white,
    fontWeight: '600',
  },
});
