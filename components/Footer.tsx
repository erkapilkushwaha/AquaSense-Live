import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Footer({ scrollRefs }: any) {
  
  // Navigation Function with Highlight/Blink Logic
  const scrollToSection = (ref: any) => {
    if (ref && ref.current) {
      ref.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        // Aapke index.tsx mein scrollView ka ref use karke scroll karega
        scrollRefs.mainScroll.current.scrollTo({ y: pageY, animated: true });
      });
    }
  };

  const openSocial = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.footerContainer}>
      {/* Left Section: Identity & Info */}
      <View style={styles.leftSection}>
        <View style={styles.brandRow}>
          <Text style={styles.appName}>AquaSense Live</Text>
          <View style={styles.onlineDot} />
        </View>
        
        <Text style={styles.appMeta}>Version: 2.0.1-STABLE</Text>
        <Text style={styles.appMeta}>Mentor: Dr. Utkarsh Shukla (HOD CSE)</Text>

        <Text style={styles.heading}>DEVELOPER INFORMATION</Text>
        <View style={styles.devInfo}>
          <Text style={styles.infoText}><Text style={styles.label}>Name:</Text> Aneesh Kumar</Text>
          <Text style={styles.infoText}><Text style={styles.label}>Branch:</Text> Computer Science & Eng.</Text>
          <Text style={styles.infoText}><Text style={styles.label}>Year:</Text> Final Year</Text>
          <Text style={styles.infoText}><Text style={styles.label}>Roll No:</Text> 2205270100004</Text>
          
          <View style={styles.orgRow}>
             <Text style={styles.infoText}><Text style={styles.label}>Org:</Text> Sunrise Institute of Engineering Technology & Management</Text>
             <Image 
                source={require('../assets/images/college_logo.png')} 
                style={styles.collegeLogo}
                resizeMode="contain"
             />
          </View>
        </View>

        {/* Contact Icons */}
        <View style={styles.socialRow}>
          <TouchableOpacity onPress={() => openSocial('tel:+918957326639')}>
            <MaterialCommunityIcons name="phone" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openSocial('https://wa.me/918957326639')}>
            <MaterialCommunityIcons name="whatsapp" size={22} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openSocial('https://www.instagram.com/bhaiya_jee_07?igsh=ZmFmdjExZDZ4bG5h')}>
            <MaterialCommunityIcons name="instagram" size={22} color="#C13584" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Right Section: Navigation & Tech */}
      <View style={styles.rightSection}>
        <Text style={styles.heading}>QUICK LINKS</Text>
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => scrollToSection(scrollRefs.dashboard)} style={styles.navItem}>
            <Text style={styles.navText}>{'>'} Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection(scrollRefs.graphs)} style={styles.navItem}>
            <Text style={styles.navText}>{'>'} Graphs & Trends</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection(scrollRefs.analysis)} style={styles.navItem}>
            <Text style={styles.navText}>{'>'} Analysis Report</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollToSection(scrollRefs.standards)} style={styles.navItem}>
            <Text style={styles.navText}>{'>'} WHO Standards</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.heading, {marginTop: 25}]}>TECH STACK</Text>
        <View style={styles.techStack}>
          <MaterialCommunityIcons name="react" size={18} color="#61dafb" />
          <MaterialCommunityIcons name="arduino" size={18} color="#00979d" />
          <MaterialCommunityIcons name="language-typescript" size={18} color="#3178c6" />
          <MaterialCommunityIcons name="usb-port" size={18} color="#fff" />
        </View>
        
        <Text style={styles.copyright}>© 2026 AquaSense Live</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    backgroundColor: '#000',
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: '#00d4ff',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  leftSection: { width: '58%' },
  rightSection: { width: '38%', alignItems: 'flex-end' },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  appName: { color: '#00d4ff', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00ff00', marginLeft: 8, shadowColor: '#00ff00', shadowRadius: 5, elevation: 5 },
  appMeta: { color: '#666', fontSize: 10, marginBottom: 2 },
  heading: { color: '#444', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginVertical: 12 },
  devInfo: { gap: 4 },
  infoText: { color: '#eee', fontSize: 11, lineHeight: 16 },
  label: { color: '#00d4ff', fontWeight: '700' },
  orgRow: { marginTop: 10 },
  collegeLogo: { width: 60, height: 60, marginTop: 8 },
  socialRow: { flexDirection: 'row', gap: 20, marginTop: 25 },
  navLinks: { gap: 10 },
  navItem: { paddingVertical: 2 },
  navText: { color: '#888', fontSize: 11, fontWeight: '500' },
  techStack: { flexDirection: 'row', gap: 12, marginTop: 5, opacity: 0.7 },
  copyright: { color: '#222', fontSize: 8, marginTop: 30 }
});
