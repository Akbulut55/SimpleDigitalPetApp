import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type PetProps = {
  name: string;
  species: string;
  hunger: number;
  happiness: number;
  onFeed: () => void;
  onPlay: () => void;
};

function Pet(props: PetProps) {
  return (
    <View>
      <Text>Name: {props.name}</Text>
      <Text>Species: {props.species}</Text>
      <Text>Hunger: {props.hunger}</Text>
      <Text>Happiness: {props.happiness}</Text>

      <Button title="Feed" onPress={props.onFeed} />
      <Button title="Play" onPress={props.onPlay} />
    </View>
  );
}

export default function App() {
  const [hunger, setHunger] = useState(50);
  const [happiness, setHappiness] = useState(50);

  const handleFeed = () => {
    setHunger(prev => Math.max(0, prev - 10));
  };

  const handlePlay = () => {
    setHappiness(prev => Math.min(prev + 10, 100));
    setHunger(prev => Math.min(prev + 5, 100));
  };

  return (
    <View style={styles.container}>
      <Pet
        name="Mochi"
        species="Cat"
        hunger={hunger}
        happiness={happiness}
        onFeed={handleFeed}
        onPlay={handlePlay}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});