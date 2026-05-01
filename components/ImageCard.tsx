import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width * 0.9) / 2 - 10; // Baki cards jaisa width logic

export default function ImageCard() {
  return (
    <View style={styles.card}>
      <Image 
        // Maan lete hain image ka naam 'drinking_water.png' rakha hai aapne
        source={require('../assets/images/drinking_water.png')} 
        style={styles.image}
        resizeMode="cover" // Card ke andar pura fill ho jaye
      />
      {/* Ek chhota overlay glow taaki dark theme se match kare */}
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: 120, // Sensor cards ki height ke barabar
    backgroundColor: '#001a33',
    borderRadius: 15,
    margin: 5,
    overflow: 'hidden', // Taki image ke corners bhi round ho jayein
    borderWidth: 1,
    borderColor: '#00d4ff22',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.9, // Thoda dark rakhenge taaki theme ke sath blend ho
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 31, 63, 0.2)', // Dashboard ke blue tone ke sath blend karne ke liye
  }
});
