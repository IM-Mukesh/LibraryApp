import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, Shadows } from '../theme/theme';
import { InfoRowProps } from '../types/ProfileTypes';

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  isLast = false,
}) => {
  return (
    <>
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
      {!isLast && <View style={styles.divider} />}
    </>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  infoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.subtle,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconText: {
    fontSize: FontSizes.large,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
    marginLeft: 66,
  },
});

export default InfoRow;
