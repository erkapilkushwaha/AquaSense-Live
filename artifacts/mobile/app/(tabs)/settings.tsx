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
import { useWaterData } from "@/context/WaterDataContext";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { refresh } = useWaterData();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alertNotifications, setAlertNotifications] = useState(true);
  const [highAlerts, setHighAlerts] = useState(true);
  const [mediumAlerts, setMediumAlerts] = useState(true);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

  const handleClearData = () => {
    Alert.alert(
      "Reset Data",
      "This will refresh all station data and clear alert history. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => refresh(),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom:
            insets.bottom + (Platform.OS === "web" ? 34 : 0) + 16,
          paddingTop: topPaddingWeb,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>
        Settings
      </Text>

      <Section title="Data & Refresh" colors={colors}>
        <SettingRow
          label="Auto Refresh"
          description="Update data every 30 seconds"
          colors={colors}
        >
          <Switch
            value={autoRefresh}
            onValueChange={setAutoRefresh}
            trackColor={{ true: colors.primary }}
            thumbColor={colors.card}
          />
        </SettingRow>
        <Divider colors={colors} />
        <SettingRow label="Units" description="Measurement units" colors={colors}>
          <View style={styles.unitToggle}>
            <TouchableOpacity
              style={[
                styles.unitBtn,
                {
                  backgroundColor: unit === "metric" ? colors.primary : colors.muted,
                },
              ]}
              onPress={() => setUnit("metric")}
            >
              <Text
                style={[
                  styles.unitText,
                  {
                    color:
                      unit === "metric"
                        ? colors.primaryForeground
                        : colors.foreground,
                  },
                ]}
              >
                Metric
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitBtn,
                {
                  backgroundColor:
                    unit === "imperial" ? colors.primary : colors.muted,
                },
              ]}
              onPress={() => setUnit("imperial")}
            >
              <Text
                style={[
                  styles.unitText,
                  {
                    color:
                      unit === "imperial"
                        ? colors.primaryForeground
                        : colors.foreground,
                  },
                ]}
              >
                Imperial
              </Text>
            </TouchableOpacity>
          </View>
        </SettingRow>
      </Section>

      <Section title="Notifications" colors={colors}>
        <SettingRow
          label="Alert Notifications"
          description="Receive push notifications for alerts"
          colors={colors}
        >
          <Switch
            value={alertNotifications}
            onValueChange={setAlertNotifications}
            trackColor={{ true: colors.primary }}
            thumbColor={colors.card}
          />
        </SettingRow>
        <Divider colors={colors} />
        <SettingRow
          label="High Priority Alerts"
          description="Critical water quality events"
          colors={colors}
        >
          <Switch
            value={highAlerts}
            onValueChange={setHighAlerts}
            trackColor={{ true: colors.poor }}
            thumbColor={colors.card}
            disabled={!alertNotifications}
          />
        </SettingRow>
        <Divider colors={colors} />
        <SettingRow
          label="Medium Priority Alerts"
          description="Warning level events"
          colors={colors}
        >
          <Switch
            value={mediumAlerts}
            onValueChange={setMediumAlerts}
            trackColor={{ true: colors.warning }}
            thumbColor={colors.card}
            disabled={!alertNotifications}
          />
        </SettingRow>
      </Section>

      <Section title="About" colors={colors}>
        <InfoRow label="Version" value="1.0.0" colors={colors} />
        <Divider colors={colors} />
        <InfoRow label="Stations" value="6 active" colors={colors} />
        <Divider colors={colors} />
        <InfoRow label="Protocol" value="WQ-Monitor v2" colors={colors} />
      </Section>

      <TouchableOpacity
        style={[styles.dangerBtn, { borderColor: colors.poor }]}
        onPress={handleClearData}
      >
        <Feather name="refresh-cw" size={15} color={colors.poor} />
        <Text style={[styles.dangerText, { color: colors.poor }]}>
          Reset Data
        </Text>
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
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
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
        <Text style={[styles.settingLabel, { color: colors.foreground }]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.settingDesc, { color: colors.mutedForeground }]}>
            {description}
          </Text>
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
      <Text style={[styles.settingLabel, { color: colors.foreground }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: colors.mutedForeground }]}>
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
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    paddingTop: 12,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 4,
  },
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  settingLeft: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  settingDesc: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  infoValue: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
  unitToggle: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
  },
  unitBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  unitText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  dangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  dangerText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});
