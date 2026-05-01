import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width * 0.9) / 2 - 10; // 2 columns ke liye width calculation

interface SensorProps {
  label: string;
  value: string | number;
  unit: string;
  icon: any;
  color: string;
}

export default function SensorCard({ label, value, unit, icon, color }: SensorProps) {
  return (
    <View style={[styles.card, { borderColor: color + '44' }]}>
      {/* Icon and Label Row */}
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
        <Text style={styles.label}>{label}</Text>
      </View>

      {/* Value and Unit */}
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: color, shadowColor: color }]}>
          {value}
        </Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>

      {/* Decorative Neon Bar */}
      <View style={[styles.bottomBar, { backgroundColor: color, shadowColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#001a33',
    borderRadius: 15,
    padding: 15,
    margin: 5,
    borderWidth: 1,
    elevation: 5, // Android shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: '#888',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 5,
    letterSpacing: 1,
  },
  valueContainer: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  value: {
    fontSize: 28,
    fontWeight: '900',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  unit: {
    color: '#888',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  bottomBar: {
    height: 3,
    width: '100%',
    marginTop: 10,
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    opacity: 0.6,
  },
});
