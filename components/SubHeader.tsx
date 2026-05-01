import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SubHeader({ status = "Device Disconnected" }) {
  // Status ke hisaab se icon badalna
  const getIcon = () => {
    if (status.includes("Connected")) return "usb";
    if (status.includes("Searching")) return "search";
    return "usb-off";
  };

  return (
    <View style={styles.subContainer}>
      <MaterialIcons name={getIcon()} size={16} color="#00d4ff" />
      <Text style={styles.infoText}>{status.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001529',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  infoText: {
    color: '#00d4ff',
    fontSize: 11,
    letterSpacing: 1,
    marginLeft: 5,
    fontWeight: '600',
  }
});
