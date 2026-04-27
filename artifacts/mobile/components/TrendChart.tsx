import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { useColors } from "@/hooks/useColors";
import type { TrendPoint } from "../types";

interface TrendChartProps {
  points: TrendPoint[];
  color: string;
  height?: number;
  label?: string;
}

export function TrendChart({
  points,
  color,
  height = 80,
  label,
}: TrendChartProps) {
  const colors = useColors();

  const { linePath, fillPath } = useMemo(() => {
    if (points.length < 2) return { linePath: "", fillPath: "" };
    const width = 300;
    const h = height - 10;
    const values = points.map((p) => p.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const toX = (i: number) => (i / (points.length - 1)) * width;
    const toY = (v: number) => h - ((v - minVal) / range) * (h - 4) - 2;

    const pts = points.map((p, i) => ({ x: toX(i), y: toY(p.value) }));

    let linePath = `M ${pts[0].x} ${pts[0].y}`;
    let fillPath = `M ${pts[0].x} ${h}`;
    fillPath += ` L ${pts[0].x} ${pts[0].y}`;

    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpX = (prev.x + curr.x) / 2;
      linePath += ` C ${cpX} ${prev.y} ${cpX} ${curr.y} ${curr.x} ${curr.y}`;
      fillPath += ` C ${cpX} ${prev.y} ${cpX} ${curr.y} ${curr.x} ${curr.y}`;
    }

    fillPath += ` L ${pts[pts.length - 1].x} ${h} Z`;
    return { linePath, fillPath };
  }, [points, height]);

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { height }]}>
        <View
          style={{
            flex: 1,
            borderBottomWidth: 2,
            borderColor: color,
            opacity: 0.5,
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      {label && (
        <Text style={[styles.label, { color: colors.mutedForeground }]}>
          {label}
        </Text>
      )}
      <Svg width="100%" height={height - 10} viewBox={`0 0 300 ${height - 10}`}>
        <Defs>
          <LinearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.3" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {fillPath ? (
          <Path
            d={fillPath}
            fill={`url(#grad-${color})`}
          />
        ) : null}
        {linePath ? (
          <Path
            d={linePath}
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        ) : null}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  label: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    position: "absolute",
    top: 0,
    left: 0,
  },
});
