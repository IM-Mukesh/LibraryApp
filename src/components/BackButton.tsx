import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSizes, Spacing, Radius } from '../theme/theme';

interface HeaderBackProps {
  title?: string;
}

const HeaderBack: React.FC<HeaderBackProps> = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title || ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    elevation: 4, // Android
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomLeftRadius: Radius.sm,
    borderBottomRightRadius: Radius.sm,
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // To offset icon space and truly center title
  },
});

export default HeaderBack;
