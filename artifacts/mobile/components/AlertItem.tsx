import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Alert } from "../types";
import { formatRelativeTime } from "../utils/format";

interface AlertItemProps {
  alert: Alert;
  onResolve: () => void;
}

export function AlertItem({ alert, onResolve }: AlertItemProps) {
  const colors = useColors();

  const severityColor =
    alert.severity === "high"
      ? colors.poor
      : alert.severity === "medium"
      ? colors.warning
      : colors.primary;

  const severityIcon =
    alert.severity === "high"
      ? "alert-triangle"
      : alert.severity === "medium"
      ? "alert-circle"
      : "info";

  const handleResolve = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onResolve();
  };

  return (
    <View
      style={[
        styles.item,
        {
          backgroundColor: colors.card,
          borderColor: alert.resolved ? colors.border : severityColor + "40",
          opacity: alert.resolved ? 0.6 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: severityColor + "18" },
        ]}
      >
        <Feather name={severityIcon as any} size={18} color={severityColor} />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.stationName, { color: colors.foreground }]}>
            {alert.stationName}
          </Text>
          <Text style={[styles.time, { color: colors.mutedForeground }]}>
            {formatRelativeTime(alert.timestamp)}
          </Text>
        </View>
        <Text style={[styles.metric, { color: severityColor }]}>
          {alert.metricLabel}
        </Text>
        <Text style={[styles.message, { color: colors.mutedForeground }]}>
          {alert.message}
        </Text>

        {!alert.resolved && (
          <Pressable onPress={handleResolve} style={styles.resolveBtn}>
            <Feather name="check-circle" size={13} color={colors.primary} />
            <Text style={[styles.resolveText, { color: colors.primary }]}>
              Mark resolved
            </Text>
          </Pressable>
        )}
        {alert.resolved && (
          <View style={styles.resolvedRow}>
            <Feather name="check-circle" size={13} color={colors.good} />
            <Text style={[styles.resolvedText, { color: colors.good }]}>
              Resolved
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    gap: 12,
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stationName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  time: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  metric: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  message: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  resolveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  resolveText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  resolvedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  resolvedText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
});
