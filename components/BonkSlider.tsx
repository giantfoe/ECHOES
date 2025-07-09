import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface BonkSliderProps {
  value?: number;
  onValueChange?: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  label?: string;
}

export const BonkSlider: React.FC<BonkSliderProps> = ({
  value = 0,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleValueChange = (newValue: number) => {
    setCurrentValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Slider
        style={styles.slider}
        value={currentValue}
        onValueChange={handleValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#E5E5E5"
      />
      <Text style={styles.valueText}>{Math.round(currentValue)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thumb: {
    backgroundColor: '#007AFF',
    width: 20,
    height: 20,
  },
  valueText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});

export default BonkSlider;