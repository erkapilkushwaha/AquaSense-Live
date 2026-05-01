import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Header() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isUsbConnected, setIsUsbConnected] = useState(false); // Ye hardware se link hoga

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    // Yahan permissions popup ka logic aayega baad mein
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <MaterialCommunityIcons name="water-check" size={30} color="#00d4ff" />
        <Text style={styles.appName}>AquaSense <Text style={{color: '#fff'}}>Live</Text></Text>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.toggleGroup}>
          <Text style={[styles.statusText, {color: isEnabled ? '#00ff00' : '#888'}]}>
            {isEnabled ? 'LIVE' : 'OFF'}
          </Text>
          <Switch
            trackColor={{ false: "#3e3e3e", true: "#00d4ff" }}
            thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        
        {/* Connection Dot */}
        <View style={[styles.dot, {backgroundColor: isUsbConnected ? '#00ff00' : '#ff4136'}]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#001f3f',
    borderBottomWidth: 1,
    borderBottomColor: '#003366',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginLeft: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  }
});
