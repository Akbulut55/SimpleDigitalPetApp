import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PetTheme = {
  emoji: string;
  mood: string;
  cardBg: string;
  buttonBg: string;
  border: string;
};

type PetProps = {
  name: string;
  species: string;
  hunger: number;
  happiness: number;
  onFeed: () => void;
  onPlay: () => void;
  theme: PetTheme;
};

const clamp = (value: number) => Math.max(0, Math.min(100, value));

const getMoodFromState = (hunger: number, happiness: number): PetTheme => {
  if (hunger >= 85 && happiness <= 20)
    return {
      emoji: '😿',
      mood: 'Starving and upset',
      cardBg: '#fff1f2',
      buttonBg: '#be123c',
      border: '#e11d48',
    };

  if (hunger >= 80)
    return {
      emoji: '🐱',
      mood: 'Hungry, wants a snack',
      cardBg: '#fef3c7',
      buttonBg: '#d97706',
      border: '#f59e0b',
    };

  if (happiness <= 20)
    return {
      emoji: '🥺',
      mood: 'Sad and lonely',
      cardBg: '#fdf2f8',
      buttonBg: '#be185d',
      border: '#db2777',
    };

  if (happiness >= 80 && hunger < 50)
    return {
      emoji: '😸',
      mood: 'Excited and well fed',
      cardBg: '#ecfeff',
      buttonBg: '#0891b2',
      border: '#06b6d4',
    };

  if (happiness >= 60)
    return {
      emoji: '😺',
      mood: 'Happy and playful',
      cardBg: '#eff6ff',
      buttonBg: '#2563eb',
      border: '#3b82f6',
    };

  return {
    emoji: '😌',
    mood: 'Calm and stable',
    cardBg: '#f8fafc',
    buttonBg: '#0f766e',
    border: '#14b8a6',
  };
};

function Pet({
  name,
  species,
  hunger,
  happiness,
  onFeed,
  onPlay,
  theme,
}: PetProps) {
  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
      <Text style={styles.emoji}>{theme.emoji}</Text>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.species}>A gentle {species}</Text>

      <Text style={styles.moodLabel}>Mood: {theme.mood}</Text>

      <View style={styles.statWrap}>
        <Text style={styles.statText}>Hunger: {hunger}</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${hunger}%` }]} />
        </View>
      </View>

      <View style={styles.statWrap}>
        <Text style={styles.statText}>Happiness: {happiness}</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${happiness}%`, backgroundColor: '#22c55e' }]} />
        </View>
      </View>

      <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.buttonBg }]} onPress={onFeed}>
        <Text style={styles.actionButtonText}>Feed</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.buttonBg, marginTop: 10 }]} onPress={onPlay}>
        <Text style={styles.actionButtonText}>Play</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [hunger, setHunger] = useState(60);
  const [happiness, setHappiness] = useState(10);

  const petTheme = useMemo(() => getMoodFromState(hunger, happiness), [hunger, happiness]);

  const handleFeed = () => {
    setHunger(prev => clamp(prev - 10));
  };

  const handlePlay = () => {
    setHappiness(prev => clamp(prev + 10));
    setHunger(prev => clamp(prev + 5));
  };

  return (
    <View style={[styles.container, { backgroundColor: petTheme.cardBg }]}>
      <Pet
        name="Mochi"
        species="cat"
        hunger={hunger}
        happiness={happiness}
        onFeed={handleFeed}
        onPlay={handlePlay}
        theme={petTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 24,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0f172a',
  },
  species: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 6,
  },
  moodLabel: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 8,
  },
  statWrap: {
    width: '100%',
    marginBottom: 12,
  },
  statText: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 6,
    fontWeight: '500',
  },
  barTrack: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#cbd5e1',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#0ea5e9',
  },
  actionButton: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
});
