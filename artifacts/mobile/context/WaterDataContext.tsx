import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Alert, Station } from "../types";
import { generateMockStations, generateAlerts } from "../utils/mockData";

interface WaterDataContextType {
  stations: Station[];
  alerts: Alert[];
  loading: boolean;
  lastRefreshed: Date | null;
  refresh: () => void;
  resolveAlert: (alertId: string) => void;
  getStation: (id: string) => Station | undefined;
  unreadAlertCount: number;
}

const WaterDataContext = createContext<WaterDataContextType | null>(null);

export function WaterDataProvider({ children }: { children: React.ReactNode }) {
  const [stations, setStations] = useState<Station[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("wqm_stations");
      const storedAlerts = await AsyncStorage.getItem("wqm_alerts");

      if (stored) {
        const parsed = JSON.parse(stored) as Station[];
        const revived = parsed.map((s) => ({
          ...s,
          lastUpdated: new Date(s.lastUpdated),
          metrics: s.metrics,
        }));
        setStations(revived);
      } else {
        const fresh = generateMockStations();
        setStations(fresh);
        await AsyncStorage.setItem("wqm_stations", JSON.stringify(fresh));
      }

      if (storedAlerts) {
        const parsed = JSON.parse(storedAlerts) as Alert[];
        const revived = parsed.map((a) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        }));
        setAlerts(revived);
      } else {
        const fresh = generateAlerts();
        setAlerts(fresh);
        await AsyncStorage.setItem("wqm_alerts", JSON.stringify(fresh));
      }
    } catch {
      const fresh = generateMockStations();
      setStations(fresh);
      setAlerts(generateAlerts());
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    const updated = generateMockStations();
    const updatedAlerts = generateAlerts();
    setStations(updated);
    setAlerts(updatedAlerts);
    await AsyncStorage.setItem("wqm_stations", JSON.stringify(updated));
    await AsyncStorage.setItem("wqm_alerts", JSON.stringify(updatedAlerts));
    setLoading(false);
    setLastRefreshed(new Date());
  }, []);

  const resolveAlert = useCallback(
    async (alertId: string) => {
      const updated = alerts.map((a) =>
        a.id === alertId ? { ...a, resolved: true } : a
      );
      setAlerts(updated);
      await AsyncStorage.setItem("wqm_alerts", JSON.stringify(updated));
    },
    [alerts]
  );

  const getStation = useCallback(
    (id: string) => stations.find((s) => s.id === id),
    [stations]
  );

  const unreadAlertCount = alerts.filter((a) => !a.resolved).length;

  useEffect(() => {
    loadData();
    intervalRef.current = setInterval(() => {
      refresh();
    }, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <WaterDataContext.Provider
      value={{
        stations,
        alerts,
        loading,
        lastRefreshed,
        refresh,
        resolveAlert,
        getStation,
        unreadAlertCount,
      }}
    >
      {children}
    </WaterDataContext.Provider>
  );
}

export function useWaterData() {
  const ctx = useContext(WaterDataContext);
  if (!ctx) throw new Error("useWaterData must be used within WaterDataProvider");
  return ctx;
}
