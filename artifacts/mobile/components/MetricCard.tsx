import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { WaterMetric } from "../types";
import { formatValue } from "../utils/format";

interface MetricCardProps {
  metric: WaterMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const colors = useColors();

  const statusColor =
    metric.status === "good"
      ? colors.good
      : metric.status === "moderate"
      ? colors.warning
      : colors.poor;

  const progress = Math.min(
    1,
    Math.max(0, (metric.value - metric.min) / (metric.max - metric.min))
  );

  const idealLeft = (metric.ideal.min - metric.min) / (metric.max - metric.min);
  const idealWidth =
    (metric.ideal.max - metric.ideal.min) / (metric.max - metric.min);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: statusColor + "18" },
          ]}
        >
          <Feather
            name={metric.icon as any}
            size={16}
            color={statusColor}
          />
        </View>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>
          {metric.label}
        </Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: colors.foreground }]}>
          {formatValue(metric.value, metric.unit)}
        </Text>
        <Text style={[styles.unit, { color: colors.mutedForeground }]}>
          {metric.unit}
        </Text>
      </View>

      <View style={styles.barBg}>
        <View
          style={[
            styles.idealRange,
            {
              left: `${idealLeft * 100}%`,
              width: `${idealWidth * 100}%`,
              backgroundColor: colors.good + "30",
            },
          ]}
        />
        <View
          style={[
            styles.bar,
            {
              width: `${progress * 100}%`,
              backgroundColor: statusColor,
            },
          ]}
        />
      </View>

      <View style={styles.rangeRow}>
        <Text style={[styles.rangeText, { color: colors.mutedForeground }]}>
          {metric.min}
        </Text>
        <Text style={[styles.rangeText, { color: colors.mutedForeground }]}>
          Ideal: {metric.ideal.min}–{metric.ideal.max}
        </Text>
        <Text style={[styles.rangeText, { color: colors.mutedForeground }]}>
          {metric.max}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 8,
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  value: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  unit: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  barBg: {
    height: 5,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
    position: "relative",
  },
  idealRange: {
    position: "absolute",
    top: 0,
    bottom: 0,
  },
  bar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 3,
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeText: {
    fontSize: 9,
    fontFamily: "Inter_400Regular",
  },
});
