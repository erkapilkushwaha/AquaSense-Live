import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Station } from "../types";

interface SummaryBarProps {
  stations: Station[];
}

export function SummaryBar({ stations }: SummaryBarProps) {
  const colors = useColors();
  const good = stations.filter((s) => s.status === "good").length;
  const moderate = stations.filter((s) => s.status === "moderate").length;
  const poor = stations.filter((s) => s.status === "poor").length;
  const total = stations.length;

  const avgScore =
    total > 0
      ? Math.round(stations.reduce((acc, s) => acc + s.overallScore, 0) / total)
      : 0;

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Stat label="Stations" value={`${total}`} color={colors.primary} />
      <Divider color={colors.border} />
      <Stat label="Healthy" value={`${good}`} color={colors.good} />
      <Divider color={colors.border} />
      <Stat label="Moderate" value={`${moderate}`} color={colors.warning} />
      <Divider color={colors.border} />
      <Stat label="Poor" value={`${poor}`} color={colors.poor} />
      <Divider color={colors.border} />
      <Stat label="Avg Score" value={`${avgScore}`} color={colors.accent} />
    </View>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.stat}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

function Divider({ color }: { color: string }) {
  return (
    <View style={[styles.divider, { backgroundColor: color }]} />
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
    gap: 2,
    flex: 1,
  },
  value: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  label: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  divider: {
    width: 1,
    height: 30,
    opacity: 0.4,
  },
});
