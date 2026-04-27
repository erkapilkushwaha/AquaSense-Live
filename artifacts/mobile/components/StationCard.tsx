import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Station } from "../types";
import { formatRelativeTime } from "../utils/format";
import { StatusBadge } from "./StatusBadge";
import * as Haptics from "expo-haptics";

interface StationCardProps {
  station: Station;
  onPress: () => void;
}

export function StationCard({ station, onPress }: StationCardProps) {
  const colors = useColors();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };
  const handlePress = () => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    onPress();
  };

  const scoreColor =
    station.overallScore >= 80
      ? colors.good
      : station.overallScore >= 50
      ? colors.warning
      : colors.poor;

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.top}>
          <View style={styles.titleBlock}>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {station.name}
            </Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={11} color={colors.mutedForeground} />
              <Text style={[styles.location, { color: colors.mutedForeground }]}>
                {station.location}
              </Text>
            </View>
          </View>
          <View style={styles.scoreWrap}>
            <Text style={[styles.score, { color: scoreColor }]}>
              {station.overallScore}
            </Text>
            <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>
              /100
            </Text>
          </View>
        </View>

        <View style={styles.bottom}>
          <StatusBadge status={station.status} size="sm" />
          <View style={styles.timeRow}>
            <Feather name="clock" size={10} color={colors.mutedForeground} />
            <Text style={[styles.time, { color: colors.mutedForeground }]}>
              {formatRelativeTime(station.lastUpdated)}
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  location: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  scoreWrap: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 1,
  },
  score: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    flex: 1,
  },
  time: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
