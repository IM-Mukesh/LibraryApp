import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { Colors, Spacing, FontSizes, Radius } from '../../theme/theme';

interface NotesInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

const NotesInput: React.FC<NotesInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter notes... (optional)',
}) => {
  return (
    <View style={[styles.container, { marginBottom: Spacing.sm }]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: Colors.white,
            color: Colors.primary,
            borderColor: Colors.border,
            borderRadius: Spacing.md,
            padding: Spacing.sm + Spacing.xs,
            fontSize: FontSizes.medium,
          },
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.primary}
        multiline
        numberOfLines={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    textAlignVertical: 'top', // for multiline to align at top
  },
});

export default NotesInput;
