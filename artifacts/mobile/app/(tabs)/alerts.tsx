import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useWaterData } from "@/context/WaterDataContext";
import { AlertItem } from "@/components/AlertItem";

export default function AlertsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { alerts, loading, refresh, resolveAlert } = useWaterData();
  const [showResolved, setShowResolved] = useState(false);

  const active = alerts.filter((a) => !a.resolved);
  const resolved = alerts.filter((a) => a.resolved);
  const displayed = showResolved ? alerts : active;

  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

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
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refresh}
          tintColor={colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Alerts
        </Text>
        {active.length > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.poor }]}>
            <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>
              {active.length}
            </Text>
          </View>
        )}
      </View>

      {/* Summary row */}
      <View style={styles.summaryRow}>
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.poor + "18", borderColor: colors.poor + "40" },
          ]}
        >
          <Text style={[styles.summaryValue, { color: colors.poor }]}>
            {active.filter((a) => a.severity === "high").length}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
            High
          </Text>
        </View>
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.warning + "18", borderColor: colors.warning + "40" },
          ]}
        >
          <Text style={[styles.summaryValue, { color: colors.warning }]}>
            {active.filter((a) => a.severity === "medium").length}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
            Medium
          </Text>
        </View>
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.primary + "18", borderColor: colors.primary + "40" },
          ]}
        >
          <Text style={[styles.summaryValue, { color: colors.primary }]}>
            {active.filter((a) => a.severity === "low").length}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
            Low
          </Text>
        </View>
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.good + "18", borderColor: colors.good + "40" },
          ]}
        >
          <Text style={[styles.summaryValue, { color: colors.good }]}>
            {resolved.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
            Resolved
          </Text>
        </View>
      </View>

      {/* Toggle resolved */}
      {resolved.length > 0 && (
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setShowResolved(!showResolved)}
        >
          <Feather
            name={showResolved ? "eye-off" : "eye"}
            size={14}
            color={colors.primary}
          />
          <Text style={[styles.toggleText, { color: colors.primary }]}>
            {showResolved ? "Hide resolved" : `Show ${resolved.length} resolved`}
          </Text>
        </TouchableOpacity>
      )}

      {/* Alerts list */}
      {displayed.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="check-circle" size={40} color={colors.good} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            All clear
          </Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            No active alerts across any stations.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {displayed.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onResolve={() => resolveAlert(alert.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 12,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    alignItems: "center",
    gap: 2,
  },
  summaryValue: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toggleText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  list: {
    gap: 10,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
