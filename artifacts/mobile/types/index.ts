export type WaterQualityStatus = "good" | "moderate" | "poor" | "unknown";

export interface SensorReading {
  tds: number;
  ph: number;
  turbidity: number;
  temperature: number;
  flowRate: number;
  timestamp: Date;
  rawString: string;
}

export interface SensorCard {
  id: "tds" | "ph" | "turbidity" | "temperature" | "flowRate";
  label: string;
  shortLabel: string;
  value: number;
  unit: string;
  icon: string;
  min: number;
  max: number;
  ideal: { min: number; max: number };
  status: WaterQualityStatus;
  description: string;
}

export interface Alert {
  id: string;
  sensorId: string;
  sensorLabel: string;
  message: string;
  severity: "high" | "medium" | "low";
  timestamp: Date;
  resolved: boolean;
}

export interface TrendPoint {
  timestamp: Date;
  value: number;
}

export interface ReadingHistory {
  id: string;
  reading: SensorReading;
}
