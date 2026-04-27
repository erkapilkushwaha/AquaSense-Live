import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Alert, ReadingHistory, SensorCard, SensorReading } from "../types";
import {
  buildSensorCards,
  generateMockRawString,
  parseRawSensorString,
} from "../utils/dataParser";

interface SensorDataContextType {
  sensorCards: SensorCard[];
  currentReading: SensorReading | null;
  history: ReadingHistory[];
  alerts: Alert[];
  loading: boolean;
  lastUpdated: Date | null;
  rawInput: string;
  parseAndUpdate: (raw: string) => boolean;
  setRawInput: (v: string) => void;
  resolveAlert: (alertId: string) => void;
  refresh: () => void;
  unreadAlertCount: number;
}

const SensorDataContext = createContext<SensorDataContextType | null>(null);

function generateHomeAlerts(cards: SensorCard[]): Alert[] {
  const now = new Date();
  const alerts: Alert[] = [];

  cards.forEach((card) => {
    if (card.status === "poor") {
      alerts.push({
        id: `alert-${card.id}-${now.getTime()}`,
        sensorId: card.id,
        sensorLabel: card.label,
        message:
          card.id === "ph"
            ? `Tap water pH is ${card.value.toFixed(1)} — outside the safe drinking range (6.5–8.5). Consider a filter.`
            : card.id === "tds"
            ? `TDS reading of ${card.value.toFixed(0)} PPM is high. Water may have excess minerals or contaminants.`
            : card.id === "turbidity"
            ? `Water clarity (${card.value.toFixed(2)} NTU) is poor. Cloudiness may indicate contamination.`
            : card.id === "temperature"
            ? `Water temperature is ${card.value.toFixed(1)}°C — unusually high for domestic supply.`
            : `Flow rate of ${card.value.toFixed(1)} L/min is outside the normal range. Check your plumbing.`,
        severity: "high",
        timestamp: new Date(now.getTime() - Math.random() * 1800000),
        resolved: false,
      });
    } else if (card.status === "moderate") {
      alerts.push({
        id: `alert-mod-${card.id}-${now.getTime()}`,
        sensorId: card.id,
        sensorLabel: card.label,
        message:
          card.id === "ph"
            ? `pH level (${card.value.toFixed(1)}) is approaching the edge of the safe range.`
            : card.id === "tds"
            ? `TDS at ${card.value.toFixed(0)} PPM is slightly elevated. Monitor regularly.`
            : card.id === "turbidity"
            ? `Some cloudiness detected (${card.value.toFixed(2)} NTU). Let water run for a minute.`
            : card.id === "temperature"
            ? `Water temperature (${card.value.toFixed(1)}°C) is slightly warm for drinking.`
            : `Flow rate (${card.value.toFixed(1)} L/min) slightly outside the normal range.`,
        severity: "medium",
        timestamp: new Date(now.getTime() - Math.random() * 7200000),
        resolved: false,
      });
    }
  });

  return alerts.slice(0, 4);
}

export function SensorDataProvider({ children }: { children: React.ReactNode }) {
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [sensorCards, setSensorCards] = useState<SensorCard[]>([]);
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [rawInput, setRawInput] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const historyRef = useRef<ReadingHistory[]>([]);

  const applyReading = useCallback((reading: SensorReading) => {
    const cards = buildSensorCards(reading);
    setSensorCards(cards);
    setCurrentReading(reading);
    setLastUpdated(reading.timestamp);

    const newEntry: ReadingHistory = {
      id: `${reading.timestamp.getTime()}`,
      reading,
    };
    const updated = [newEntry, ...historyRef.current].slice(0, 50);
    historyRef.current = updated;
    setHistory(updated);
    setAlerts(generateHomeAlerts(cards));
  }, []);

  const parseAndUpdate = useCallback(
    (raw: string): boolean => {
      const parsed = parseRawSensorString(raw);
      if (!parsed) return false;
      applyReading(parsed);
      return true;
    },
    [applyReading]
  );

  const refresh = useCallback(() => {
    setLoading(true);
    const raw = generateMockRawString();
    const parsed = parseRawSensorString(raw);
    if (parsed) applyReading(parsed);
    setLoading(false);
  }, [applyReading]);

  const resolveAlert = useCallback(
    (alertId: string) => {
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)));
    },
    []
  );

  const unreadAlertCount = alerts.filter((a) => !a.resolved).length;

  useEffect(() => {
    refresh();
    intervalRef.current = setInterval(() => {
      const raw = generateMockRawString();
      const parsed = parseRawSensorString(raw);
      if (parsed) applyReading(parsed);
    }, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <SensorDataContext.Provider
      value={{
        sensorCards,
        currentReading,
        history,
        alerts,
        loading,
        lastUpdated,
        rawInput,
        parseAndUpdate,
        setRawInput,
        resolveAlert,
        refresh,
        unreadAlertCount,
      }}
    >
      {children}
    </SensorDataContext.Provider>
  );
}

export function useSensorData() {
  const ctx = useContext(SensorDataContext);
  if (!ctx) throw new Error("useSensorData must be used within SensorDataProvider");
  return ctx;
}
