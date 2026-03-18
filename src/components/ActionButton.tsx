import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type ActionButtonProps = {
  title: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  isDarkMode?: boolean;
};

const withHash = (color: string) => (color.startsWith('#') ? color : `#${color}`);

const getLuma = (hex: string) => {
  const clean = withHash(hex).replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return 0.5;
  }

  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

export const ActionButton = ({ title, color, onPress, disabled = false, isDarkMode = false }: ActionButtonProps) => {
  const background = withHash(color);
  const luma = getLuma(background);
  const textColor = isDarkMode ? '#f8fafc' : luma > 0.62 ? '#0f172a' : '#f8fafc';
  const disabledBg = isDarkMode ? '#334155' : '#cbd5e1';
  const disabledBorder = isDarkMode ? 'rgba(148, 163, 184, 0.4)' : 'rgba(148, 163, 184, 0.5)';

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        {
          backgroundColor: disabled ? disabledBg : background,
          borderColor: disabled ? disabledBorder : 'rgba(255, 255, 255, 0.45)',
          shadowColor: background,
        },
        disabled ? styles.actionButtonDisabled : null,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.86}
    >
      <Text style={[styles.actionButtonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 48,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  actionButtonDisabled: {
    opacity: 0.45,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.24,
    textAlign: 'center',
  },
});
