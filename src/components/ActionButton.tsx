import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type ActionButtonProps = {
  title: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
};

export const ActionButton = ({ title, color, onPress, disabled = false }: ActionButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: color }, disabled ? styles.actionButtonDisabled : null]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.86}
    >
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  actionButtonDisabled: {
    opacity: 0.45,
  },
  actionButtonText: {
    color: '#f8fafc',
    fontSize: 16,
    letterSpacing: 0.3,
    fontWeight: '700',
  },
});
