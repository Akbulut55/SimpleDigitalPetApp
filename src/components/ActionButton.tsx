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

const mixHex = (hex: string, targetHex: string, amount: number) => {
  const source = withHash(hex).replace('#', '');
  const target = withHash(targetHex).replace('#', '');

  if (!/^[0-9a-fA-F]{6}$/.test(source) || !/^[0-9a-fA-F]{6}$/.test(target)) {
    return withHash(hex);
  }

  const blend = (start: number, end: number) =>
    Math.round(start + (end - start) * amount)
      .toString(16)
      .padStart(2, '0');

  const sr = parseInt(source.substring(0, 2), 16);
  const sg = parseInt(source.substring(2, 4), 16);
  const sb = parseInt(source.substring(4, 6), 16);
  const tr = parseInt(target.substring(0, 2), 16);
  const tg = parseInt(target.substring(2, 4), 16);
  const tb = parseInt(target.substring(4, 6), 16);

  return `#${blend(sr, tr)}${blend(sg, tg)}${blend(sb, tb)}`;
};

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
  const disabledBorder = isDarkMode ? 'rgba(148, 163, 184, 0.35)' : 'rgba(148, 163, 184, 0.45)';
  const borderColor = mixHex(background, '#ffffff', 0.28);
  const shadowTint = mixHex(background, '#000000', 0.12);

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        {
          backgroundColor: disabled ? disabledBg : background,
          borderColor: disabled ? disabledBorder : borderColor,
          shadowColor: disabled ? disabledBg : shadowTint,
          shadowOpacity: disabled ? 0.12 : 0.34,
        },
        disabled ? styles.actionButtonDisabled : null,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.88}
    >
      <Text style={[styles.actionButtonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 52,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 14,
    elevation: 7,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.18,
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
