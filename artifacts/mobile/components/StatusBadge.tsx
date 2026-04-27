import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { WaterQualityStatus } from "../types";
import { statusLabel } from "../utils/format";

interface StatusBadgeProps {
  status: WaterQualityStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const colors = useColors();

  const bgColor =
    status === "good"
      ? colors.good + "22"
      : status === "moderate"
      ? colors.warning + "22"
      : status === "poor"
      ? colors.poor + "22"
      : colors.unknown + "22";

  const textColor =
    status === "good"
      ? colors.good
      : status === "moderate"
      ? colors.warning
      : status === "poor"
      ? colors.poor
      : colors.unknown;

  const dotColor =
    status === "good"
      ? colors.good
      : status === "moderate"
      ? colors.warning
      : status === "poor"
      ? colors.poor
      : colors.unknown;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, size === "sm" && styles.sm]}>
      <View style={[styles.dot, { backgroundColor: dotColor }, size === "sm" && styles.dotSm]} />
      <Text style={[styles.label, { color: textColor }, size === "sm" && styles.labelSm]}>
        {statusLabel(status)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  sm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotSm: {
    width: 5,
    height: 5,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  labelSm: {
    fontSize: 11,
  },
});
