import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useWaterData } from "@/context/WaterDataContext";
import { SummaryBar } from "@/components/SummaryBar";
import { StationCard } from "@/components/StationCard";
import { AlertItem } from "@/components/AlertItem";
import { formatRelativeTime } from "@/utils/format";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { stations, alerts, loading, lastRefreshed, refresh, resolveAlert } =
    useWaterData();

  const activeAlerts = alerts.filter((a) => !a.resolved).slice(0, 3);
  const topStations = [...stations]
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, 4);

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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            Water Quality
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Dashboard
          </Text>
        </View>
        <View style={styles.headerRight}>
          {lastRefreshed && (
            <Text style={[styles.refreshed, { color: colors.mutedForeground }]}>
              {formatRelativeTime(lastRefreshed)}
            </Text>
          )}
          {loading && <ActivityIndicator size="small" color={colors.primary} />}
        </View>
      </View>

      {/* Summary */}
      <SummaryBar stations={stations} />

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Feather name="alert-triangle" size={15} color={colors.poor} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Active Alerts
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={16}
              color={colors.mutedForeground}
            />
          </View>
          <View style={styles.list}>
            {activeAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onResolve={() => resolveAlert(alert.id)}
              />
            ))}
          </View>
        </View>
      )}

      {/* Stations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Feather name="radio" size={15} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Monitoring Stations
            </Text>
          </View>
          <Text
            style={[styles.seeAll, { color: colors.primary }]}
            onPress={() => router.push("/(tabs)/stations")}
          >
            See all
          </Text>
        </View>
        <View style={styles.list}>
          {topStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onPress={() =>
                router.push({ pathname: "/station/[id]", params: { id: station.id } })
              }
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 12,
  },
  greeting: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshed: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  seeAll: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  list: {
    gap: 10,
  },
});
