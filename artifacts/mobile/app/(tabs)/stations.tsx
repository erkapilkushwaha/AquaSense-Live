import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useSensorData } from "@/context/SensorDataContext";
import { formatRelativeTime } from "@/utils/format";

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { history, loading, refresh, sensorCards } = useSensorData();
  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

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
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Readings</Text>
        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {history.length} saved
        </Text>
      </View>

      {/* Current snapshot */}
      {sensorCards.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
            Current Snapshot
          </Text>
          <View
            style={[
              styles.snapshotCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {sensorCards.map((card, i) => {
              const statusColor =
                card.status === "good"
                  ? colors.good
                  : card.status === "moderate"
                  ? colors.warning
                  : colors.poor;
              return (
                <React.Fragment key={card.id}>
                  <View style={styles.snapshotRow}>
                    <View style={styles.snapshotLeft}>
                      <Feather name={card.icon as any} size={14} color={statusColor} />
                      <Text style={[styles.snapshotLabel, { color: colors.foreground }]}>
                        {card.label}
                      </Text>
                    </View>
                    <View style={styles.snapshotRight}>
                      <Text style={[styles.snapshotValue, { color: statusColor }]}>
                        {card.unit === "pH" || card.unit === "°C" || card.unit === "L/min"
                          ? card.value.toFixed(1)
                          : card.unit === "NTU"
                          ? card.value.toFixed(2)
                          : Math.round(card.value).toString()}
                      </Text>
                      <Text style={[styles.snapshotUnit, { color: colors.mutedForeground }]}>
                        {card.unit}
                      </Text>
                    </View>
                  </View>
                  {i < sensorCards.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>
      )}

      {/* History log */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          Reading History
        </Text>
        {history.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="inbox" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No readings yet
            </Text>
          </View>
        ) : (
          <View style={styles.logList}>
            {history.map((entry, i) => {
              const r = entry.reading;
              const good = [r.ph, r.tds, r.turbidity, r.temperature, r.flowRate].filter((_, idx) => {
                const ideals = [
                  { min: 6.5, max: 8.5 },
                  { min: 50, max: 300 },
                  { min: 0, max: 1 },
                  { min: 10, max: 25 },
                  { min: 6, max: 12 },
                ];
                const v = [r.ph, r.tds, r.turbidity, r.temperature, r.flowRate][idx];
                return v >= ideals[idx].min && v <= ideals[idx].max;
              }).length;
              const dotColor = good >= 4 ? colors.good : good >= 2 ? colors.warning : colors.poor;

              return (
                <View
                  key={entry.id}
                  style={[
                    styles.logEntry,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      opacity: i > 0 ? Math.max(0.5, 1 - i * 0.05) : 1,
                    },
                  ]}
                >
                  <View style={[styles.logDot, { backgroundColor: dotColor }]} />
                  <View style={styles.logContent}>
                    <Text style={[styles.logRaw, { color: colors.foreground }]}>
                      {r.rawString}
                    </Text>
                    <Text style={[styles.logTime, { color: colors.mutedForeground }]}>
                      {formatRelativeTime(r.timestamp)} · {good}/5 sensors safe
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 14 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingTop: 12,
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  count: { fontSize: 13, fontFamily: "Inter_400Regular" },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 2,
  },
  snapshotCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  snapshotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  snapshotLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  snapshotLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  snapshotRight: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  snapshotValue: { fontSize: 17, fontFamily: "Inter_700Bold" },
  snapshotUnit: { fontSize: 11, fontFamily: "Inter_400Regular" },
  divider: { height: 1, marginHorizontal: 14 },
  empty: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 30,
    alignItems: "center",
    gap: 8,
  },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  logList: { gap: 8 },
  logEntry: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 10,
    alignItems: "flex-start",
  },
  logDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
  logContent: { flex: 1, gap: 3 },
  logRaw: { fontSize: 12, fontFamily: "Inter_500Medium", letterSpacing: 0.3 },
  logTime: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
