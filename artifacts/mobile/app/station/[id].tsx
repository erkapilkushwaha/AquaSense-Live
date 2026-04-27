import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useWaterData } from "@/context/WaterDataContext";
import { MetricCard } from "@/components/MetricCard";
import { ScoreGauge } from "@/components/ScoreGauge";
import { StatusBadge } from "@/components/StatusBadge";
import { TrendChart } from "@/components/TrendChart";
import { generateTrendData } from "@/utils/mockData";
import { formatRelativeTime } from "@/utils/format";

export default function StationDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getStation } = useWaterData();

  const station = getStation(id ?? "");

  const trendData = useMemo(() => {
    if (!station) return [];
    const primary = station.metrics[0];
    return generateTrendData(primary.id, primary.value, 24);
  }, [station]);

  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

  if (!station) {
    return (
      <View
        style={[styles.notFound, { backgroundColor: colors.background }]}
      >
        <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>
          Station not found
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  const primaryMetric = station.metrics[0];
  const chartColor =
    primaryMetric.status === "good"
      ? colors.good
      : primaryMetric.status === "moderate"
      ? colors.warning
      : colors.poor;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom:
            insets.bottom + (Platform.OS === "web" ? 34 : 0) + 24,
          paddingTop: topPaddingWeb,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Back button */}
      <Pressable style={styles.back} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color={colors.primary} />
        <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
      </Pressable>

      {/* Hero card */}
      <View
        style={[
          styles.heroCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.heroTop}>
          <View style={styles.heroInfo}>
            <Text style={[styles.heroName, { color: colors.foreground }]}>
              {station.name}
            </Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={12} color={colors.mutedForeground} />
              <Text style={[styles.location, { color: colors.mutedForeground }]}>
                {station.location}
              </Text>
            </View>
            <View style={styles.locationRow}>
              <Feather name="clock" size={12} color={colors.mutedForeground} />
              <Text style={[styles.location, { color: colors.mutedForeground }]}>
                Updated {formatRelativeTime(station.lastUpdated)}
              </Text>
            </View>
          </View>
          <ScoreGauge score={station.overallScore} size={130} />
        </View>
        <StatusBadge status={station.status} />

        {/* Trend chart */}
        <View style={styles.trendSection}>
          <Text style={[styles.trendLabel, { color: colors.mutedForeground }]}>
            {primaryMetric.label} — 24h trend
          </Text>
          <TrendChart
            points={trendData}
            color={chartColor}
            height={70}
          />
        </View>
      </View>

      {/* Metrics grid */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        Measurements
      </Text>
      <View style={styles.grid}>
        {station.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </View>

      {/* Coordinates */}
      <View
        style={[
          styles.coordCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Feather name="navigation" size={16} color={colors.primary} />
        <Text style={[styles.coordText, { color: colors.mutedForeground }]}>
          {station.latitude.toFixed(4)}°N, {station.longitude.toFixed(4)}°W
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    gap: 14,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
  },
  backLink: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 12,
  },
  backText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  heroCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroInfo: {
    flex: 1,
    gap: 6,
    paddingTop: 4,
  },
  heroName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    flexShrink: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  trendSection: {
    gap: 6,
  },
  trendLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  coordCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  coordText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
});
