import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useColors } from "@/hooks/useColors";
import { scoreLabel } from "../utils/format";

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 140 }: ScoreGaugeProps) {
  const colors = useColors();
  const strokeWidth = 12;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 100;
  const dashOffset = circumference * (1 - progress * 0.75);
  const startAngle = 135;
  const center = size / 2;

  const scoreColor =
    score >= 80 ? colors.good : score >= 50 ? colors.warning : colors.poor;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {Platform.OS !== "web" ? (
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={scoreColor} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={scoreColor} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.muted}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            strokeDashoffset={-circumference * 0.125}
            strokeLinecap="round"
            rotation={startAngle}
            origin={`${center}, ${center}`}
          />
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#scoreGrad)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference * 0.75 * progress} ${circumference}`}
            strokeDashoffset={-circumference * 0.125}
            strokeLinecap="round"
            rotation={startAngle}
            origin={`${center}, ${center}`}
          />
        </Svg>
      ) : (
        <View
          style={[
            styles.webCircle,
            {
              width: size,
              height: size,
              borderColor: scoreColor,
            },
          ]}
        />
      )}
      <View style={styles.center}>
        <Text style={[styles.score, { color: scoreColor }]}>{score}</Text>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>
          {scoreLabel(score)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginTop: -2,
  },
  webCircle: {
    position: "absolute",
    borderRadius: 9999,
    borderWidth: 8,
    opacity: 0.4,
  },
});
