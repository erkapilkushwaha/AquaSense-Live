import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AnalysisReport({ sensorData }: any) {
  // 1. Logic for each sensor
  const getTdsInfo = (val: number) => {
    if (val < 300) return { msg: "Excellent purity.", color: "#00FF00" };
    if (val < 600) return { msg: "Good for drinking.", color: "#FFB800" };
    return { msg: "High TDS. Filtration needed.", color: "#FF4136" };
  };

  const getPhInfo = (val: number) => {
    if (val >= 6.5 && val <= 8.5) return { msg: "Perfect pH balance.", color: "#00FF00" };
    return { msg: "Imbalanced pH levels.", color: "#FF4136" };
  };

  const getTurbInfo = (val: number) => {
    if (val <= 1) return { msg: "Water is crystal clear.", color: "#00FF00" };
    if (val <= 5) return { msg: "Slightly cloudy water.", color: "#FFB800" };
    return { msg: "High turbidity detected.", color: "#FF4136" };
  };

  const getTempInfo = (val: number) => {
    if (val >= 20 && val <= 30) return { msg: "Ideal water temperature.", color: "#00FF00" };
    return { msg: "Temp outside normal range.", color: "#00d4ff" };
  };

  const getFlowInfo = (val: number) => {
    if (val > 0) return { msg: "Water flow is active.", color: "#00FF00" };
    return { msg: "No water flow detected.", color: "#888" };
  };

  // 2. Overall Status Logic
  const isUnsafe = sensorData.tds > 600 || sensorData.ph < 6.5 || sensorData.ph > 8.5 || sensorData.turb > 5;
  const masterColor = isUnsafe ? "#FF4136" : "#00FF00";
  const masterStatus = isUnsafe ? "UNSAFE / ACTION REQUIRED" : "SAFE / POTABLE";

  return (
    <View style={[styles.container, { borderColor: masterColor + '88' }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="shield-check-outline" size={20} color={masterColor} />
        <Text style={[styles.title, { color: masterColor }]}>ANALYSIS REPORT: {masterStatus}</Text>
      </View>

      <View style={styles.reportGrid}>
        {[
          { label: 'TDS', ...getTdsInfo(sensorData.tds) },
          { label: 'pH', ...getPhInfo(sensorData.ph) },
          { label: 'TURB', ...getTurbInfo(sensorData.turb) },
          { label: 'TEMP', ...getTempInfo(sensorData.temp) },
          { label: 'FLOW', ...getFlowInfo(sensorData.flow) },
        ].map((item, idx) => (
          <View key={idx} style={styles.reportRow}>
            <Text style={styles.label}>{item.label}:</Text>
            <Text style={[styles.msg, { color: item.color }]}>{item.msg}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    backgroundColor: '#000',
    borderRadius: 15,
    borderWidth: 1.5,
    padding: 15,
    marginVertical: 10,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
    paddingBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 1,
  },
  reportGrid: {
    gap: 10,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#888',
    fontSize: 10,
    width: 45,
    fontWeight: 'bold',
  },
  msg: {
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  }
});
