import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useSensorData } from "@/context/SensorDataContext";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { refresh } = useSensorData();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [highAlerts, setHighAlerts] = useState(true);
  const [mediumAlerts, setMediumAlerts] = useState(true);
  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

  const handleReset = () => {
    Alert.alert(
      "Reset Readings",
      "This will clear all saved data and generate a fresh reading. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => refresh() },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 16,
          paddingTop: topPaddingWeb,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>

      <Section title="Sensor Updates" colors={colors}>
        <SettingRow
          label="Auto Refresh"
          description="Update readings every 10 seconds"
          colors={colors}
        >
          <Switch
            value={autoRefresh}
            onValueChange={setAutoRefresh}
            trackColor={{ true: colors.primary }}
            thumbColor={colors.card}
          />
        </SettingRow>
      </Section>

      <Section title="Notifications" colors={colors}>
        <SettingRow
          label="Water Alerts"
          description="Receive alerts when sensors go out of range"
          colors={colors}
        >
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: colors.primary }}
            thumbColor={colors.card}
          />
        </SettingRow>
        <Divider colors={colors} />
        <SettingRow label="High Priority" description="Urgent water quality issues" colors={colors}>
          <Switch
            value={highAlerts}
            onValueChange={setHighAlerts}
            trackColor={{ true: colors.poor }}
            thumbColor={colors.card}
            disabled={!notifications}
          />
        </SettingRow>
        <Divider colors={colors} />
        <SettingRow label="Caution Alerts" description="Moderate range warnings" colors={colors}>
          <Switch
            value={mediumAlerts}
            onValueChange={setMediumAlerts}
            trackColor={{ true: colors.warning }}
            thumbColor={colors.card}
            disabled={!notifications}
          />
        </SettingRow>
      </Section>

      <Section title="Sensor Thresholds" colors={colors}>
        <InfoRow label="pH Safe Range" value="6.5 – 8.5" colors={colors} />
        <Divider colors={colors} />
        <InfoRow label="TDS Safe Range" value="50 – 300 PPM" colors={colors} />
        <Divider colors={colors} />
        <InfoRow label="Turbidity Limit" value="≤ 1.0 NTU" colors={colors} />
        <Divider colors={colors} />
        <InfoRow label="Temperature Range" value="10 – 25 °C" colors={colors} />
        <Divider colors={colors} />
        <InfoRow label="Flow Rate Range" value="6 – 12 L/min" colors={colors} />
      </Section>

      <Section title="Data Format" colors={colors}>
        <InfoRow label="Input Format" value="TDS|pH|Turbidity|Temp|Flow" colors={colors} />
        <Divider colors={colors} />
        <InfoRow label="Delimiter" value="Pipe character  |" colors={colors} />
        <Divider colors={colors} />
        <InfoRow label="Example" value="220|7.2|0.4|22.5|8.1" colors={colors} />
      </Section>

      <Section title="About" colors={colors}>
        <InfoRow label="App" value="AquaSense Live" colors={colors} />
        <Divider colors={colors} />
        <InfoRow label="Version" value="1.0.0" colors={colors} />
        <Divider colors={colors} />
        <InfoRow label="Developer" value="Aneesh Kumar" colors={colors} />
        <Divider colors={colors} />
        <InfoRow label="Institution" value="Sunrise Institute of Engg. Technology & Mgmt." colors={colors} />
      </Section>

      <TouchableOpacity
        style={[styles.dangerBtn, { borderColor: colors.poor }]}
        onPress={handleReset}
      >
        <Feather name="refresh-cw" size={15} color={colors.poor} />
        <Text style={[styles.dangerText, { color: colors.poor }]}>Reset Sensor Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

function SettingRow({
  label,
  description,
  children,
  colors,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Text style={[styles.settingLabel, { color: colors.foreground }]}>{label}</Text>
        {description && (
          <Text style={[styles.settingDesc, { color: colors.mutedForeground }]}>{description}</Text>
        )}
      </View>
      {children}
    </View>
  );
}

function InfoRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={[styles.settingLabel, { color: colors.foreground }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.mutedForeground }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Divider({ colors }: { colors: ReturnType<typeof import("@/hooks/useColors").useColors> }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", paddingTop: 12 },
  section: { gap: 6 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 4,
  },
  sectionCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  settingLeft: { flex: 1, gap: 2 },
  settingLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  settingDesc: { fontSize: 11, fontFamily: "Inter_400Regular" },
  infoValue: { fontSize: 12, fontFamily: "Inter_400Regular", flexShrink: 1, textAlign: "right" },
  divider: { height: 1, marginHorizontal: 14 },
  dangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  dangerText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});
