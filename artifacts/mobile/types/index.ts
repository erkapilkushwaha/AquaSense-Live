export type WaterQualityStatus = "good" | "moderate" | "poor" | "unknown";

export interface WaterMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  ideal: { min: number; max: number };
  status: WaterQualityStatus;
  icon: string;
}

export interface Station {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: WaterQualityStatus;
  lastUpdated: Date;
  overallScore: number;
  metrics: WaterMetric[];
}

export interface Alert {
  id: string;
  stationId: string;
  stationName: string;
  metricLabel: string;
  message: string;
  severity: "high" | "medium" | "low";
  timestamp: Date;
  resolved: boolean;
}

export interface TrendPoint {
  timestamp: Date;
  value: number;
}

export interface MetricTrend {
  metricId: string;
  points: TrendPoint[];
}
