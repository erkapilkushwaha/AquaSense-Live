import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, ToastAndroid } from "react-native";

export type USBStatus =
  | "disconnected"
  | "scanning"
  | "connecting"
  | "connected"
  | "error";

let UsbSerialManager: any = null;
let Parity: any = null;

try {
  if (Platform.OS === "android") {
    const mod = require("react-native-usb-serialport-for-android");
    UsbSerialManager = mod.UsbSerialManager;
    Parity = mod.Parity;
  }
} catch (_) {}

function hexToAscii(hex: string): string {
  let str = "";
  for (let i = 0; i + 1 < hex.length; i += 2) {
    const code = parseInt(hex.substring(i, i + 2), 16);
    if (!isNaN(code)) str += String.fromCharCode(code);
  }
  return str;
}

function showToast(msg: string) {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }
}

interface UseUSBSerialOptions {
  onData: (raw: string) => void;
  onDisconnect?: () => void;
}

export function useUSBSerial({ onData, onDisconnect }: UseUSBSerialOptions) {
  const [status, setStatus] = useState<USBStatus>("disconnected");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const serialRef = useRef<any>(null);
  const bufferRef = useRef<string>("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onDataRef = useRef(onData);
  const onDisconnectRef = useRef(onDisconnect);

  useEffect(() => {
    onDataRef.current = onData;
    onDisconnectRef.current = onDisconnect;
  });

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const handleDisconnect = useCallback(
    (reason: string) => {
      try {
        serialRef.current?.close();
      } catch (_) {}
      serialRef.current = null;
      bufferRef.current = "";
      stopPolling();
      setStatus("error");
      setErrorMessage(reason);
      showToast(reason);
      onDisconnectRef.current?.();
    },
    [stopPolling]
  );

  const connect = useCallback(async () => {
    if (Platform.OS !== "android" || !UsbSerialManager) {
      setErrorMessage("USB Serial is only available in the Android APK build.");
      setStatus("error");
      return;
    }

    setStatus("scanning");
    setErrorMessage(null);

    try {
      const devices = await UsbSerialManager.list();

      if (!devices || devices.length === 0) {
        setStatus("error");
        const msg = "No USB device found. Plug in your Arduino via OTG adapter.";
        setErrorMessage(msg);
        showToast(msg);
        return;
      }

      const device = devices[0];
      setStatus("connecting");

      const granted = await UsbSerialManager.tryRequestPermission(
        device.deviceId
      );

      if (!granted) {
        setStatus("disconnected");
        const msg = "USB permission denied. Allow access to proceed.";
        setErrorMessage(msg);
        showToast(msg);
        return;
      }

      const serial = await UsbSerialManager.open(device.deviceId, {
        baudRate: 9600,
        parity: Parity?.None ?? 0,
        dataBits: 8,
        stopBits: 1,
      });

      serialRef.current = serial;
      bufferRef.current = "";
      setStatus("connected");
      setErrorMessage(null);
      showToast("Arduino connected at 9600 baud");

      serial.onReceived((event: { data: string }) => {
        try {
          const ascii = hexToAscii(event.data);
          bufferRef.current += ascii;
          const lines = bufferRef.current.split("\n");
          if (lines.length > 1) {
            bufferRef.current = lines[lines.length - 1];
            for (let i = 0; i < lines.length - 1; i++) {
              const line = lines[i].trim().replace(/\r/g, "");
              if (line.length > 0) {
                onDataRef.current(line);
              }
            }
          }
        } catch (_) {}
      });

      pollRef.current = setInterval(async () => {
        try {
          const current = await UsbSerialManager.list();
          const stillConnected = current?.some(
            (d: any) => d.deviceId === device.deviceId
          );
          if (!stillConnected) {
            handleDisconnect("Hardware Disconnected. OTG device was removed.");
          }
        } catch (_) {
          handleDisconnect("Hardware Disconnected. Lost connection to device.");
        }
      }, 2000);
    } catch (err: any) {
      const msg =
        "Connection failed: " + (err?.message ?? "Unknown error");
      setStatus("error");
      setErrorMessage(msg);
      showToast(msg);
    }
  }, [handleDisconnect]);

  const disconnect = useCallback(() => {
    try {
      serialRef.current?.close();
    } catch (_) {}
    serialRef.current = null;
    bufferRef.current = "";
    stopPolling();
    setStatus("disconnected");
    setErrorMessage(null);
  }, [stopPolling]);

  useEffect(() => {
    return () => {
      try {
        serialRef.current?.close();
      } catch (_) {}
      stopPolling();
    };
  }, [stopPolling]);

  return { status, errorMessage, connect, disconnect };
}
