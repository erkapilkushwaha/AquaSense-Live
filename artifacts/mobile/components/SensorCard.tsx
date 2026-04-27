import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { SensorCard as SensorCardType } from "../types";

interface SensorCardProps {
  card: SensorCardType;
}

export function SensorCard({ card }: SensorCardProps) {
  const colors = useColors();

  const statusColor =
    card.status === "good"
      ? colors.good
      : card.status === "moderate"
      ? colors.warning
      : colors.poor;

  const progress = Math.min(1, Math.max(0, (card.value - card.min) / (card.max - card.min)));
  const idealLeft = (card.ideal.min - card.min) / (card.max - card.min);
  const idealWidth = (card.ideal.max - card.ideal.min) / (card.max - card.min);

  const statusLabel =
    card.status === "good" ? "Safe" : card.status === "moderate" ? "Caution" : "Alert";

  const displayValue =
    card.unit === "pH" || card.unit === "°C"
      ? card.value.toFixed(1)
      : card.unit === "NTU"
      ? card.value.toFixed(2)
      : card.unit === "L/min"
      ? card.value.toFixed(1)
      : Math.round(card.value).toString();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: statusColor + "50",
          borderLeftColor: statusColor,
        },
      ]}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: statusColor + "18" }]}>
          <Feather name={card.icon as any} size={18} color={statusColor} />
        </View>
        <View style={styles.titleBlock}>
          <Text style={[styles.label, { color: colors.foreground }]}>{card.label}</Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {card.description}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + "18" }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      {/* Value */}
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: colors.foreground }]}>{displayValue}</Text>
        <Text style={[styles.unit, { color: colors.mutedForeground }]}>{card.unit}</Text>
      </View>

      {/* Progress bar */}
      <View style={[styles.barBg, { backgroundColor: colors.muted }]}>
        <View
          style={[
            styles.idealZone,
            {
              left: `${idealLeft * 100}%` as any,
              width: `${idealWidth * 100}%` as any,
              backgroundColor: colors.good + "30",
            },
          ]}
        />
        <View
          style={[
            styles.bar,
            { width: `${progress * 100}%` as any, backgroundColor: statusColor },
          ]}
        />
      </View>

      <View style={styles.rangeRow}>
        <Text style={[styles.rangeText, { color: colors.mutedForeground }]}>
          {card.min} {card.unit}
        </Text>
        <Text style={[styles.rangeText, { color: colors.good }]}>
          Ideal: {card.ideal.min}–{card.ideal.max}
        </Text>
        <Text style={[styles.rangeText, { color: colors.mutedForeground }]}>
          {card.max} {card.unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 16,
    gap: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  description: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 15,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
  },
  value: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
  },
  unit: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  barBg: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    position: "relative",
  },
  idealZone: {
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
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
});
