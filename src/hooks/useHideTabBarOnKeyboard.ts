// src/hooks/useHideTabBarOnKeyboard.ts
import { useFocusEffect } from '@react-navigation/native';
import { Keyboard } from 'react-native';
import { useCallback } from 'react';
import { Colors } from '../theme/theme';

export const useHideTabBarOnKeyboard = (navigation: any) => {
  useFocusEffect(
    useCallback(() => {
      const show = Keyboard.addListener('keyboardDidShow', () => {
        navigation?.getParent()?.setOptions({
          tabBarStyle: { height: 0 },
        });
      });

      const hide = Keyboard.addListener('keyboardDidHide', () => {
        navigation?.getParent()?.setOptions({
          tabBarStyle: {
            height: 60,
            backgroundColor: Colors.white,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
          },
        });
      });

      return () => {
        show.remove();
        hide.remove();
      };
    }, [navigation]),
  );
};
