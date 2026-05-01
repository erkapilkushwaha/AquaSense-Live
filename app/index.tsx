import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, StatusBar, Animated, Easing } from 'react-native';

// Components Import
import Header from '../components/Header';
import SubHeader from '../components/SubHeader';
import RawDataContainer from '../components/RawDataContainer';
import SensorCard from '../components/SensorCard';
import ImageCard from '../components/ImageCard';
import GraphSection from '../components/GraphSection';
import AnalysisReport from '../components/AnalysisReport';
import StandardSection from '../components/StandardSection';
import Footer from '../components/Footer';

// Serial Service Import
import { SerialService } from '../services/SerialService';

export default function AquaSenseApp() {
  // 1. DATA STATES
  const [sensorData, setSensorData] = useState({
    tds: 0,
    ph: 7.0,
    temp: 0,
    turb: 0,
    flow: 0 // Default 0 as per your Arduino code
  });

  const [history, setHistory] = useState({
    PH: [7, 7, 7, 7, 7],
    TDS: [0, 0, 0, 0, 0],
    TURB: [0, 0, 0, 0, 0],
    TEMP: [0, 0, 0, 0, 0],
    FLOW: [0, 0, 0, 0, 0],
    OVERALL: [100, 100, 100, 100, 100]
  });

  // 2. REFS FOR NAVIGATION & ANIMATION
  const mainScroll = useRef<ScrollView>(null);
  const dashboardRef = useRef<View>(null);
  const graphsRef = useRef<View>(null);
  const analysisRef = useRef<View>(null);
  const standardsRef = useRef<View>(null);
  
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // 3. SERIAL DATA PARSING (Format: TDS|PH|TEMP|TURB)
  const parseAndUpdate = (rawString: string) => {
    try {
      const values = rawString.trim().split('|');

      if (values.length >= 4) {
        const newData = {
          tds: parseFloat(values[0]),
          ph: parseFloat(values[1]),
          temp: parseFloat(values[2]),
          turb: parseFloat(values[3]),
          flow: 0 // Flow sensor is not in your current Arduino code
        };

        setSensorData(newData);

        // Update Graphs
        setHistory(prev => ({
          PH: [...prev.PH.slice(1), newData.ph],
          TDS: [...prev.TDS.slice(1), newData.tds],
          TURB: [...prev.TURB.slice(1), newData.turb],
          TEMP: [...prev.TEMP.slice(1), newData.temp],
          FLOW: [...prev.FLOW.slice(1), 0],
          OVERALL: [...prev.OVERALL.slice(1), (newData.tds < 600 && newData.ph > 6.5) ? 95 : 45]
        }));
      }
    } catch (e) {
      console.log("Parsing Error: Use format TDS|PH|TEMP|TURB");
    }
  };

  // 4. HARDWARE INITIALIZATION
  useEffect(() => {
    // Start Real Serial Link for APK build
    const initSerial = async () => {
      await SerialService.startConnection(parseAndUpdate);
    };

    initSerial();

    return () => {
      SerialService.stopConnection();
    };
  }, []);

  // Section Highlight Animation Logic
  const highlightSection = (ref: any) => {
    // Scroll to section
    ref.current?.measureLayout(
      mainScroll.current,
      (x: any, y: any) => {
        mainScroll.current?.scrollTo({ y: y - 50, animated: true });
        
        // Blink Pulse Effect
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
          Animated.timing(pulseAnim, { toValue: 0, duration: 600, useNativeDriver: false })
        ]).start();
      },
      () => {}
    );
  };

  const highlightStyle = {
    backgroundColor: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', 'rgba(0, 212, 255, 0.1)']
    })
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Header />
      <SubHeader status={sensorData.tds > 0 ? "LIVE: Serial Active" : "Waiting for OTG Connection..."} />

      <ScrollView 
        ref={mainScroll}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
      >
        {/* Terminal Section for Demonstration */}
        <RawDataContainer onPlay={parseAndUpdate} />

        {/* Sensor Grid (Dashboard) */}
        <Animated.View ref={dashboardRef} style={[styles.section, highlightStyle]}>
          <View style={styles.grid}>
            <SensorCard label="pH VALUE" value={sensorData.ph} unit="pH" icon="ph" color="#A020F0" />
            <SensorCard label="TDS PURITY" value={sensorData.tds} unit="PPM" icon="water-opacity" color="#00d4ff" />
            <SensorCard label="TEMPERATURE" value={sensorData.temp} unit="°C" icon="thermometer" color="#FF4136" />
            <SensorCard label="TURBIDITY" value={sensorData.turb} unit="V" icon="waves" color="#FFB800" />
            <SensorCard label="FLOW RATE" value={0} unit="L/m" icon="speedometer" color="#00FF00" />
            <ImageCard />
          </View>
        </Animated.View>

        {/* Trends & Graphs */}
        <Animated.View ref={graphsRef} style={[styles.section, highlightStyle]}>
          <GraphSection allData={history} />
        </Animated.View>

        {/* AI Analysis Report */}
        <Animated.View ref={analysisRef} style={[styles.section, highlightStyle]}>
          <AnalysisReport sensorData={sensorData} />
        </Animated.View>

        {/* Water Quality Standards */}
        <Animated.View ref={standardsRef} style={[styles.section, highlightStyle]}>
          <StandardSection />
        </Animated.View>

        {/* Final Integrated Footer */}
        <Footer 
          scrollRefs={{
            mainScroll: mainScroll,
            dashboard: dashboardRef,
            graphs: graphsRef,
            analysis: analysisRef,
            standards: standardsRef
          }}
          onNavPress={highlightSection}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 0,
  },
  section: {
    marginVertical: 12,
    borderRadius: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});
