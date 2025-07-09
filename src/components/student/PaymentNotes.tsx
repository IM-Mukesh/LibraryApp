import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { Colors, Spacing, FontSizes, Radius, Shadows } from '../../theme/theme';

interface NotesInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

const NotesInput: React.FC<NotesInputProps> = ({
  value,
  onChange,
  placeholder = '✍️ Write a quick note…',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          isFocused && {
            // borderColor: Colors.neon,
            shadowColor: Colors.neon,
            shadowOpacity: 0.3,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 0 },
            elevation: 4,
          },
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={Colors.secondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={false}
          numberOfLines={1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1.2,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    ...Shadows.subtle,
  },
  input: {
    fontSize: FontSizes.medium,
    color: Colors.primary,
    paddingVertical: 6,
    fontWeight: 'bold',
  },
});

export default NotesInput;
