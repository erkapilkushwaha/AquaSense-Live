import type { Alert, Station, WaterMetric, WaterQualityStatus } from "../types";

function rand(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function metricStatus(value: number, ideal: { min: number; max: number }): WaterQualityStatus {
  const range = ideal.max - ideal.min;
  const slack = range * 0.3;
  if (value >= ideal.min && value <= ideal.max) return "good";
  if (value >= ideal.min - slack && value <= ideal.max + slack) return "moderate";
  return "poor";
}

function makeMetrics(bias: "good" | "moderate" | "poor"): WaterMetric[] {
  const shift = bias === "good" ? 0 : bias === "moderate" ? 0.5 : 1.2;

  const ph = rand(6.5 + shift * 0.3, 8.5 - shift * 0.4);
  const turbidity = rand(0.1, 1.0 + shift * 4);
  const dissolved = rand(9.5 - shift * 2, 11.5 - shift * 2.5);
  const temp = rand(15, 20 + shift * 5);
  const nitrate = rand(0.5, 5 + shift * 30);
  const conductivity = rand(200, 400 + shift * 400);

  return [
    {
      id: "ph",
      label: "pH Level",
      value: Math.max(0, Math.min(14, ph)),
      unit: "pH",
      min: 0,
      max: 14,
      ideal: { min: 6.5, max: 8.5 },
      status: metricStatus(ph, { min: 6.5, max: 8.5 }),
      icon: "droplet",
    },
    {
      id: "turbidity",
      label: "Turbidity",
      value: Math.max(0, turbidity),
      unit: "NTU",
      min: 0,
      max: 20,
      ideal: { min: 0, max: 1 },
      status: metricStatus(turbidity, { min: 0, max: 1 }),
      icon: "eye",
    },
    {
      id: "dissolved_oxygen",
      label: "Dissolved O₂",
      value: Math.max(0, dissolved),
      unit: "mg/L",
      min: 0,
      max: 15,
      ideal: { min: 7, max: 11 },
      status: metricStatus(dissolved, { min: 7, max: 11 }),
      icon: "wind",
    },
    {
      id: "temperature",
      label: "Temperature",
      value: temp,
      unit: "°C",
      min: 0,
      max: 40,
      ideal: { min: 10, max: 25 },
      status: metricStatus(temp, { min: 10, max: 25 }),
      icon: "thermometer",
    },
    {
      id: "nitrate",
      label: "Nitrate",
      value: Math.max(0, nitrate),
      unit: "mg/L",
      min: 0,
      max: 50,
      ideal: { min: 0, max: 10 },
      status: metricStatus(nitrate, { min: 0, max: 10 }),
      icon: "activity",
    },
    {
      id: "conductivity",
      label: "Conductivity",
      value: Math.max(0, conductivity),
      unit: "µS/cm",
      min: 0,
      max: 1500,
      ideal: { min: 150, max: 500 },
      status: metricStatus(conductivity, { min: 150, max: 500 }),
      icon: "zap",
    },
  ];
}

function stationStatus(metrics: WaterMetric[]): WaterQualityStatus {
  const poor = metrics.filter((m) => m.status === "poor").length;
  const moderate = metrics.filter((m) => m.status === "moderate").length;
  if (poor >= 2) return "poor";
  if (poor >= 1 || moderate >= 3) return "moderate";
  return "good";
}

function overallScore(metrics: WaterMetric[]): number {
  const scores = metrics.map((m) => {
    if (m.status === "good") return 100;
    if (m.status === "moderate") return 60;
    return 20;
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

const STATION_DATA = [
  {
    id: "s1",
    name: "River Delta Station",
    location: "Sacramento, CA",
    latitude: 38.5816,
    longitude: -121.4944,
    bias: "good" as const,
    hoursAgo: 0.25,
  },
  {
    id: "s2",
    name: "Coastal Monitor A",
    location: "San Francisco, CA",
    latitude: 37.7749,
    longitude: -122.4194,
    bias: "moderate" as const,
    hoursAgo: 0.5,
  },
  {
    id: "s3",
    name: "Lake Reservoir",
    location: "Tahoe City, CA",
    latitude: 39.1637,
    longitude: -120.1456,
    bias: "good" as const,
    hoursAgo: 1,
  },
  {
    id: "s4",
    name: "Industrial Outflow",
    location: "Stockton, CA",
    latitude: 37.9577,
    longitude: -121.2908,
    bias: "poor" as const,
    hoursAgo: 2,
  },
  {
    id: "s5",
    name: "Mountain Spring",
    location: "Yosemite, CA",
    latitude: 37.8651,
    longitude: -119.5383,
    bias: "good" as const,
    hoursAgo: 0.1,
  },
  {
    id: "s6",
    name: "Urban Catchment",
    location: "Oakland, CA",
    latitude: 37.8044,
    longitude: -122.2712,
    bias: "moderate" as const,
    hoursAgo: 3,
  },
];

export function generateMockStations(): Station[] {
  return STATION_DATA.map((s) => {
    const metrics = makeMetrics(s.bias);
    return {
      id: s.id,
      name: s.name,
      location: s.location,
      latitude: s.latitude,
      longitude: s.longitude,
      status: stationStatus(metrics),
      lastUpdated: new Date(Date.now() - s.hoursAgo * 3600000),
      overallScore: overallScore(metrics),
      metrics,
    };
  });
}

export function generateAlerts(): Alert[] {
  const now = new Date();
  return [
    {
      id: "a1",
      stationId: "s4",
      stationName: "Industrial Outflow",
      metricLabel: "Nitrate",
      message: "Nitrate levels exceeded safe threshold of 10 mg/L. Immediate action recommended.",
      severity: "high",
      timestamp: new Date(now.getTime() - 1800000),
      resolved: false,
    },
    {
      id: "a2",
      stationId: "s4",
      stationName: "Industrial Outflow",
      metricLabel: "Turbidity",
      message: "Turbidity spike detected. Possible sediment runoff or contamination event.",
      severity: "high",
      timestamp: new Date(now.getTime() - 3600000),
      resolved: false,
    },
    {
      id: "a3",
      stationId: "s2",
      stationName: "Coastal Monitor A",
      metricLabel: "pH Level",
      message: "pH approaching lower safe limit. Monitor for further decrease.",
      severity: "medium",
      timestamp: new Date(now.getTime() - 7200000),
      resolved: false,
    },
    {
      id: "a4",
      stationId: "s6",
      stationName: "Urban Catchment",
      metricLabel: "Dissolved O₂",
      message: "Dissolved oxygen trending below optimal range for aquatic life.",
      severity: "medium",
      timestamp: new Date(now.getTime() - 10800000),
      resolved: false,
    },
    {
      id: "a5",
      stationId: "s1",
      stationName: "River Delta Station",
      metricLabel: "Temperature",
      message: "Temperature slightly elevated. No immediate action required.",
      severity: "low",
      timestamp: new Date(now.getTime() - 86400000),
      resolved: true,
    },
  ];
}

export function generateTrendData(metricId: string, baseValue: number, hours = 24) {
  const points = [];
  for (let i = hours; i >= 0; i--) {
    const jitter = (Math.random() - 0.5) * baseValue * 0.15;
    points.push({
      timestamp: new Date(Date.now() - i * 3600000),
      value: Math.max(0, baseValue + jitter),
    });
  }
  return points;
}
