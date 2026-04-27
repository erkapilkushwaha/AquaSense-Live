import type { SensorCard, SensorReading, WaterQualityStatus } from "../types";

/**
 * Central data parser.
 * Accepts raw string in format: TDS_VALUE|PH_VALUE|TURB_VALUE|TEMP_VALUE|FLOW_VALUE
 * Returns a parsed SensorReading or null if the string is invalid.
 */
export function parseRawSensorString(raw: string): SensorReading | null {
  const parts = raw.trim().split("|");
  if (parts.length !== 5) return null;

  const [tdsStr, phStr, turbStr, tempStr, flowStr] = parts;
  const tds = parseFloat(tdsStr);
  const ph = parseFloat(phStr);
  const turbidity = parseFloat(turbStr);
  const temperature = parseFloat(tempStr);
  const flowRate = parseFloat(flowStr);

  if ([tds, ph, turbidity, temperature, flowRate].some(isNaN)) return null;

  return {
    tds,
    ph,
    turbidity,
    temperature,
    flowRate,
    timestamp: new Date(),
    rawString: raw.trim(),
  };
}

function sensorStatus(value: number, ideal: { min: number; max: number }): WaterQualityStatus {
  const range = ideal.max - ideal.min;
  const slack = range * 0.3;
  if (value >= ideal.min && value <= ideal.max) return "good";
  if (value >= ideal.min - slack && value <= ideal.max + slack) return "moderate";
  return "poor";
}

export function buildSensorCards(reading: SensorReading): SensorCard[] {
  return [
    {
      id: "ph",
      label: "pH Level",
      shortLabel: "pH",
      value: reading.ph,
      unit: "pH",
      icon: "droplet",
      min: 0,
      max: 14,
      ideal: { min: 6.5, max: 8.5 },
      status: sensorStatus(reading.ph, { min: 6.5, max: 8.5 }),
      description: "Measures acidity or alkalinity of your tap water.",
    },
    {
      id: "tds",
      label: "Total Dissolved Solids",
      shortLabel: "TDS",
      value: reading.tds,
      unit: "PPM",
      icon: "filter",
      min: 0,
      max: 1000,
      ideal: { min: 50, max: 300 },
      status: sensorStatus(reading.tds, { min: 50, max: 300 }),
      description: "Amount of dissolved salts and minerals in your water.",
    },
    {
      id: "turbidity",
      label: "Turbidity",
      shortLabel: "Clarity",
      value: reading.turbidity,
      unit: "NTU",
      icon: "eye",
      min: 0,
      max: 20,
      ideal: { min: 0, max: 1 },
      status: sensorStatus(reading.turbidity, { min: 0, max: 1 }),
      description: "Cloudiness or haziness of your drinking water.",
    },
    {
      id: "temperature",
      label: "Temperature",
      shortLabel: "Temp",
      value: reading.temperature,
      unit: "°C",
      icon: "thermometer",
      min: 0,
      max: 50,
      ideal: { min: 10, max: 25 },
      status: sensorStatus(reading.temperature, { min: 10, max: 25 }),
      description: "Water temperature from your household supply.",
    },
    {
      id: "flowRate",
      label: "Water Flow Rate",
      shortLabel: "Flow",
      value: reading.flowRate,
      unit: "L/min",
      icon: "trending-up",
      min: 0,
      max: 20,
      ideal: { min: 6, max: 12 },
      status: sensorStatus(reading.flowRate, { min: 6, max: 12 }),
      description: "Volume of water flowing through your pipes per minute.",
    },
  ];
}

function rand(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateMockRawString(): string {
  const tds = rand(80, 350);
  const ph = rand(6.6, 8.4);
  const turb = rand(0.05, 1.2);
  const temp = rand(16, 28);
  const flow = rand(6.5, 11.5);
  return `${tds}|${ph}|${turb}|${temp}|${flow}`;
}

export function generatePoorRawString(): string {
  const tds = rand(500, 800);
  const ph = rand(9.0, 10.5);
  const turb = rand(4, 8);
  const temp = rand(30, 40);
  const flow = rand(1, 4);
  return `${tds}|${ph}|${turb}|${temp}|${flow}`;
}
