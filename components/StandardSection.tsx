import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STANDARD_DATA = [
  { id: 'tds', label: 'TDS', full: 'Total Dissolved Solids', ideal: '0 - 500', max: '1000', unit: 'mg/L', color: '#00d4ff', info: 'TDS indicates the amount of dissolved minerals, salts, and metals. High TDS can cause a bitter taste and scale buildup.' },
  { id: 'ph', label: 'pH', full: 'Potential of Hydrogen', ideal: '6.5 - 8.5', max: '9.5', unit: 'pH Unit', color: '#A020F0', info: 'pH measures how acidic or basic water is. The range goes from 0 to 14, with 7 being neutral. WHO recommends 6.5 to 8.5 for drinking.' },
  { id: 'turb', label: 'Turbidity', full: 'Water Clarity', ideal: '0 - 5', max: '10', unit: 'NTU', color: '#FFB800', info: 'Turbidity is the cloudiness of water caused by large numbers of individual particles. It is an essential indicator of water quality.' },
  { id: 'temp', label: 'Temperature', full: 'Water Temperature', ideal: '10 - 30', max: '35', unit: '°C', color: '#FF4136', info: 'Temperature affects the taste of water and the rate of chemical reactions. Most people prefer cool drinking water.' }
];

export default function StandardSection() {
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<any>(null);
  const animation = React.useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const openPopup = (item: any) => {
    setSelectedInfo(item);
    setModalVisible(true);
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [180, 550], // Default 1-2 items vs Full list
  });

  return (
    <View style={styles.container}>
      {/* WHO Banner Section */}
      <View style={styles.whoBanner}>
        <Image source={require('../assets/images/icon.png')} style={styles.whoLogo} />
        <View>
          <Text style={styles.bannerTitle}>Standards by WHO</Text>
          <Text style={styles.bannerSub}>Guidelines for Drinking-water Quality</Text>
        </View>
        <Image source={require('../assets/images/icon.png')} style={styles.glassIcon} />
      </View>

      <Animated.View style={[styles.listContainer, { height: heightInterpolate }]}>
        {STANDARD_DATA.map((item) => (
          <TouchableOpacity key={item.id} style={styles.paramCard} onPress={() => openPopup(item)}>
            <View style={[styles.iconBox, { backgroundColor: item.color + '22' }]}>
              <MaterialCommunityIcons name="water-percent" size={24} color={item.color} />
            </View>
            <View style={styles.paramInfo}>
              <Text style={styles.paramLabel}>{item.label}</Text>
              <Text style={styles.paramFull}>{item.full}</Text>
            </View>
            <View style={styles.rangeBox}>
              <Text style={styles.rangeTitle}>Ideal Range</Text>
              <Text style={[styles.rangeVal, { color: '#00ff00' }]}>{item.ideal}</Text>
              <Text style={styles.rangeUnit}>{item.unit}</Text>
            </View>
            <View style={styles.rangeBox}>
              <Text style={styles.rangeTitle}>Max. Acceptable</Text>
              <Text style={[styles.rangeVal, { color: item.color }]}>{item.max}</Text>
              <Text style={styles.rangeUnit}>{item.unit}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Expand Button */}
      <TouchableOpacity onPress={toggleExpand} style={styles.expandBtn}>
        <MaterialCommunityIcons name={expanded ? "chevron-up" : "chevron-down"} size={28} color="#00d4ff" />
      </TouchableOpacity>

      {/* Detail Popup Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: selectedInfo?.color }]}>{selectedInfo?.label} Analysis</Text>
            <Text style={styles.modalDesc}>{selectedInfo?.info}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '95%', alignSelf: 'center', marginVertical: 10 },
  whoBanner: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  whoLogo: { width: 40, height: 40, marginRight: 10 },
  bannerTitle: { color: '#01579b', fontWeight: 'bold', fontSize: 14 },
  bannerSub: { color: '#0277bd', fontSize: 10 },
  glassIcon: { width: 40, height: 50, marginLeft: 'auto' },
  listContainer: { overflow: 'hidden', backgroundColor: '#001a33', borderRadius: 15, padding: 10 },
  paramCard: {
    flexDirection: 'row',
    backgroundColor: '#00264d',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  iconBox: { width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  paramInfo: { flex: 1, marginLeft: 10 },
  paramLabel: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  paramFull: { color: '#888', fontSize: 10 },
  rangeBox: { alignItems: 'center', marginLeft: 10 },
  rangeTitle: { color: '#888', fontSize: 8 },
  rangeVal: { fontWeight: 'bold', fontSize: 14 },
  rangeUnit: { color: '#888', fontSize: 8 },
  expandBtn: { alignSelf: 'center', marginTop: -15, backgroundColor: '#001a33', borderRadius: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#001a33', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#00d4ff' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalDesc: { color: '#ccc', lineHeight: 20, fontSize: 14 },
  closeBtn: { marginTop: 20, alignSelf: 'flex-end' },
  closeText: { color: '#00d4ff', fontWeight: 'bold' }
});
