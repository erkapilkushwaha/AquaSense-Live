import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Sensors Configuration
const SENSORS_CONFIG = {
  PH: { label: 'pH', color: '#A020F0', unit: 'pH', range: '6.5 - 8.5' },
  TDS: { label: 'TDS', color: '#00d4ff', unit: 'ppm', range: '300 - 500' },
  TURB: { label: 'TURB', color: '#FFB800', unit: 'NTU', range: '0 - 5' },
  TEMP: { label: 'TEMP', color: '#FF4136', unit: '°C', range: '20 - 35' },
  FLOW: { label: 'FLOW', color: '#00FF00', unit: 'L/m', range: '10 - 20' },
  OVERALL: { label: 'HEALTH', color: '#FFFFFF', unit: '%', range: '0 - 100' }
};

export default function GraphSection({ allData }: any) {
  const [selected, setSelected] = useState('OVERALL');

  // Pill Selection Logic
  const renderPill = (key: string) => {
    const isActive = selected === key;
    const config = SENSORS_CONFIG[key as keyof typeof SENSORS_CONFIG];
    
    return (
      <TouchableOpacity 
        key={key}
        onPress={() => setSelected(isActive ? 'OVERALL' : key)}
        style={[
          styles.pill, 
          { borderColor: config.color + '66' },
          isActive && { backgroundColor: config.color + '33', borderColor: config.color }
        ]}
      >
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        <Text style={[styles.pillText, isActive && { color: '#fff' }]}>{config.label}</Text>
        {isActive && key !== 'OVERALL' && (
          <MaterialCommunityIcons name="close-circle" size={14} color="#fff" style={{marginLeft: 5}} />
        )}
      </TouchableOpacity>
    );
  };

  // Current Config based on selection
  const currentConfig = SENSORS_CONFIG[selected as keyof typeof SENSORS_CONFIG];

  return (
    <View style={styles.container}>
      {/* 1. Header with Tag Pills */}
      <View style={styles.pillContainer}>
        {Object.keys(SENSORS_CONFIG).filter(k => k !== 'OVERALL').map(key => renderPill(key))}
      </View>

      {/* 2. Main Graph Box */}
      <View style={[styles.graphBox, { borderColor: currentConfig.color + '44' }]}>
        
        {/* Right Info Panel */}
        <View style={styles.infoPanel}>
          <Text style={styles.infoLabel}>Standard</Text>
          <Text style={[styles.infoValue, {color: currentConfig.color}]}>{currentConfig.range}</Text>
          <Text style={styles.infoUnit}>{currentConfig.unit}</Text>
        </View>

        <LineChart
          data={{
            labels: ["-4s", "-3s", "-2s", "-1s", "Now"],
            datasets: [{ 
              data: allData[selected] || [0,0,0,0,0], 
              color: (opacity = 1) => currentConfig.color,
              strokeWidth: 3 
            }]
          }}
          width={width * 0.85}
          height={180}
          chartConfig={{
            backgroundColor: "#000",
            backgroundGradientFrom: "#001a33",
            backgroundGradientTo: "#000",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(136, 136, 136, ${opacity})`,
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: currentConfig.color
            }
          }}
          bezier
          style={styles.chartStyle}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignItems: 'center',
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
    width: '95%',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    margin: 4,
    backgroundColor: '#001a33',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  pillText: {
    color: '#888',
    fontSize: 10,
    fontWeight: 'bold',
  },
  graphBox: {
    width: '95%',
    backgroundColor: '#000',
    borderRadius: 15,
    borderWidth: 1,
    paddingTop: 10,
    overflow: 'hidden',
  },
  infoPanel: {
    position: 'absolute',
    top: 10,
    right: 15,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  infoLabel: {
    color: '#555',
    fontSize: 9,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoUnit: {
    color: '#444',
    fontSize: 9,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
