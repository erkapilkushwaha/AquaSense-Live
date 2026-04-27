import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useSensorData } from "@/context/SensorDataContext";
import { SensorCard } from "@/components/SensorCard";
import { formatRelativeTime } from "@/utils/format";
import type { USBStatus } from "@/hooks/useUSBSerial";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    sensorCards,
    currentReading,
    loading,
    lastUpdated,
    rawInput,
    setRawInput,
    parseAndUpdate,
    refresh,
    usbStatus,
    usbError,
    connectUSB,
    disconnectUSB,
  } = useSensorData();

  const [parseError, setParseError] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);

  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;
  const usbConnected = usbStatus === "connected";
  const usbBusy = usbStatus === "scanning" || usbStatus === "connecting";

  const handleParse = () => {
    setParseError(false);
    setParseSuccess(false);
    const ok = parseAndUpdate(rawInput);
    if (ok) {
      setParseSuccess(true);
      setRawInput("");
      setTimeout(() => setParseSuccess(false), 2500);
    } else {
      setParseError(true);
      setTimeout(() => setParseError(false), 2500);
    }
  };

  const overallStatus =
    sensorCards.length === 0
      ? "unknown"
      : sensorCards.some((c) => c.status === "poor")
      ? "poor"
      : sensorCards.some((c) => c.status === "moderate")
      ? "moderate"
      : "good";

  const overallColor =
    overallStatus === "good"
      ? colors.good
      : overallStatus === "moderate"
      ? colors.warning
      : overallStatus === "poor"
      ? colors.poor
      : colors.mutedForeground;

  const overallLabel =
    overallStatus === "good"
      ? "Water is Safe"
      : overallStatus === "moderate"
      ? "Needs Attention"
      : overallStatus === "poor"
      ? "Action Required"
      : "Awaiting Data";

  const goodCount = sensorCards.filter((c) => c.status === "good").length;

  const usbChipColor = usbConnected
    ? colors.good
    : usbStatus === "error"
    ? colors.poor
    : usbBusy
    ? colors.warning
    : colors.mutedForeground;

  const usbChipLabel = usbConnected
    ? "Arduino Live"
    : usbStatus === "scanning"
    ? "Scanning…"
    : usbStatus === "connecting"
    ? "Connecting…"
    : usbStatus === "error"
    ? "Hardware Error"
    : "No Hardware";

  const usbChipIcon: "zap" | "zap-off" | "loader" | "alert-circle" =
    usbConnected
      ? "zap"
      : usbBusy
      ? "loader"
      : usbStatus === "error"
      ? "alert-circle"
      : "zap-off";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 20,
            paddingTop: topPaddingWeb,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.appName, { color: colors.mutedForeground }]}>
              Home Water Dashboard
            </Text>
            <Text style={[styles.title, { color: colors.foreground }]}>
              AquaSense Live
            </Text>
          </View>
          <View style={styles.headerRight}>
            {lastUpdated && !usbConnected && (
              <Text style={[styles.refreshed, { color: colors.mutedForeground }]}>
                {formatRelativeTime(lastUpdated)}
              </Text>
            )}
            {loading && <ActivityIndicator size="small" color={colors.primary} />}

            {/* Connect Hardware Button */}
            <TouchableOpacity
              style={[
                styles.connectBtn,
                {
                  backgroundColor: usbConnected
                    ? colors.good + "20"
                    : usbStatus === "error"
                    ? colors.poor + "20"
                    : usbBusy
                    ? colors.warning + "20"
                    : colors.primary + "15",
                  borderColor: usbConnected
                    ? colors.good + "60"
                    : usbStatus === "error"
                    ? colors.poor + "60"
                    : usbBusy
                    ? colors.warning + "60"
                    : colors.primary + "40",
                },
              ]}
              onPress={usbConnected ? disconnectUSB : usbBusy ? undefined : connectUSB}
              disabled={usbBusy}
              activeOpacity={0.75}
            >
              {usbBusy ? (
                <ActivityIndicator size={12} color={colors.warning} />
              ) : (
                <Feather
                  name={usbConnected ? "zap" : "zap-off"}
                  size={13}
                  color={usbConnected ? colors.good : usbStatus === "error" ? colors.poor : colors.primary}
                />
              )}
              <Text
                style={[
                  styles.connectBtnText,
                  {
                    color: usbConnected
                      ? colors.good
                      : usbStatus === "error"
                      ? colors.poor
                      : usbBusy
                      ? colors.warning
                      : colors.primary,
                  },
                ]}
              >
                {usbConnected
                  ? "Disconnect"
                  : usbStatus === "scanning"
                  ? "Scanning…"
                  : usbStatus === "connecting"
                  ? "Connecting…"
                  : "Connect Hardware"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── USB Error Banner ── */}
        {usbError !== null && (
          <View
            style={[
              styles.usbErrorBanner,
              { backgroundColor: colors.poor + "15", borderColor: colors.poor + "40" },
            ]}
          >
            <Feather name="alert-circle" size={14} color={colors.poor} />
            <Text style={[styles.usbErrorText, { color: colors.poor }]}>
              {usbError}
            </Text>
          </View>
        )}

        {/* ── Overall Status Banner ── */}
        <View
          style={[
            styles.statusBanner,
            { backgroundColor: overallColor + "15", borderColor: overallColor + "50" },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: overallColor }]} />
          <View style={styles.statusText}>
            <Text style={[styles.statusLabel, { color: overallColor }]}>
              {overallLabel}
            </Text>
            <Text style={[styles.statusSub, { color: colors.mutedForeground }]}>
              {sensorCards.length > 0
                ? `${goodCount} of ${sensorCards.length} sensors in safe range`
                : "Awaiting first reading"}
            </Text>
          </View>

          {/* USB chip or Live badge */}
          <View
            style={[
              styles.readingTag,
              { backgroundColor: usbChipColor + "18", borderWidth: 1, borderColor: usbChipColor + "40" },
            ]}
          >
            <Feather name={usbChipIcon} size={11} color={usbChipColor} />
            <Text style={[styles.readingTagText, { color: usbChipColor }]}>
              {usbChipLabel}
            </Text>
          </View>
        </View>

        {/* ── Data Parser Input ── */}
        <View
          style={[
            styles.parserCard,
            {
              backgroundColor: colors.card,
              borderColor: usbConnected ? colors.good + "60" : colors.border,
              borderWidth: usbConnected ? 1.5 : 1,
            },
          ]}
        >
          <View style={styles.parserHeader}>
            <Feather name="cpu" size={14} color={usbConnected ? colors.good : colors.primary} />
            <Text style={[styles.parserTitle, { color: colors.foreground }]}>
              {usbConnected ? "Live Hardware Feed" : "Live Sensor Input"}
            </Text>
            {usbConnected && (
              <View style={[styles.livePill, { backgroundColor: colors.good + "20" }]}>
                <View style={[styles.liveDot, { backgroundColor: colors.good }]} />
                <Text style={[styles.livePillText, { color: colors.good }]}>LIVE</Text>
              </View>
            )}
          </View>

          {usbConnected ? (
            <Text style={[styles.parserHint, { color: colors.mutedForeground }]}>
              Streaming from Arduino at{" "}
              <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.good }}>
                9600 baud
              </Text>
              . Data auto-updates below.
            </Text>
          ) : (
            <Text style={[styles.parserHint, { color: colors.mutedForeground }]}>
              Paste raw string:{" "}
              <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.accent }}>
                TDS|pH|Turbidity|Temp|Flow
              </Text>
            </Text>
          )}

          <View style={styles.parserRow}>
            <TextInput
              style={[
                styles.parserInput,
                {
                  backgroundColor: usbConnected ? colors.good + "0A" : colors.background,
                  borderColor: parseError
                    ? colors.poor
                    : parseSuccess
                    ? colors.good
                    : usbConnected
                    ? colors.good + "50"
                    : colors.border,
                  color: colors.foreground,
                },
              ]}
              placeholder={
                usbConnected
                  ? "Waiting for Arduino data…"
                  : "e.g. 220|7.2|0.4|22.5|8.1"
              }
              placeholderTextColor={colors.mutedForeground}
              value={rawInput}
              onChangeText={(v) => {
                if (!usbConnected) {
                  setRawInput(v);
                  setParseError(false);
                }
              }}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={usbConnected ? undefined : handleParse}
              returnKeyType="done"
              editable={!usbConnected}
            />
            {!usbConnected && (
              <TouchableOpacity
                style={[
                  styles.parseBtn,
                  {
                    backgroundColor: parseError
                      ? colors.poor
                      : parseSuccess
                      ? colors.good
                      : colors.primary,
                  },
                ]}
                onPress={handleParse}
              >
                <Feather
                  name={parseSuccess ? "check" : parseError ? "x" : "play"}
                  size={16}
                  color="#fff"
                />
              </TouchableOpacity>
            )}
          </View>

          {parseError && (
            <Text style={[styles.parseMsg, { color: colors.poor }]}>
              Invalid format. Use: TDS|pH|Turbidity|Temp|Flow
            </Text>
          )}
          {parseSuccess && (
            <Text style={[styles.parseMsg, { color: colors.good }]}>
              Sensor data updated successfully.
            </Text>
          )}
          {currentReading && (
            <View style={[styles.rawTag, { backgroundColor: colors.muted }]}>
              <Text style={[styles.rawTagText, { color: colors.mutedForeground }]}>
                Last raw: {currentReading.rawString}
              </Text>
            </View>
          )}
        </View>

        {/* ── 5 Sensor Cards ── */}
        <View style={styles.sectionHeader}>
          <Feather name="activity" size={14} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Sensor Readings
          </Text>
        </View>

        {sensorCards.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Loading sensor data...
            </Text>
          </View>
        ) : (
          <View style={styles.sensorList}>
            {sensorCards.map((card) => (
              <SensorCard key={card.id} card={card} />
            ))}
          </View>
        )}

        {/* ── About / Credits (always visible) ── */}
        <View
          style={[
            styles.creditsCard,
            {
              backgroundColor: colors.primary + "0F",
              borderColor: colors.primary + "30",
            },
          ]}
        >
          <View style={styles.creditsHeader}>
            <View style={[styles.creditsIcon, { backgroundColor: colors.primary }]}>
              <Feather name="award" size={16} color="#fff" />
            </View>
            <Text style={[styles.creditsTitle, { color: colors.foreground }]}>
              About This Project
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.primary + "25" }]} />
          <Text style={[styles.creditsHeading, { color: colors.mutedForeground }]}>
            Designed and Developed By:
          </Text>
          <View style={styles.creditsGrid}>
            <CreditsRow icon="user" label="Name" value="Aneesh Kumar" colors={colors} />
            <CreditsRow icon="book" label="Branch" value="Computer Science" colors={colors} />
            <CreditsRow icon="calendar" label="Year" value="Final Year" colors={colors} />
            <CreditsRow icon="hash" label="Roll No" value="2205270100004" colors={colors} />
            <CreditsRow
              icon="home"
              label="College"
              value="Sunrise Institute of Engineering Technology & Management"
              colors={colors}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function CreditsRow({
  icon,
  label,
  value,
  colors,
}: {
  icon: string;
  label: string;
  value: string;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <View style={styles.creditsRow}>
      <Feather name={icon as any} size={13} color={colors.primary} style={{ marginTop: 1 }} />
      <View style={styles.creditsRowText}>
        <Text style={[styles.creditsLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.creditsValue, { color: colors.foreground }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 14 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 12,
  },
  appName: { fontSize: 12, fontFamily: "Inter_400Regular" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  refreshed: { fontSize: 11, fontFamily: "Inter_400Regular" },
  connectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  connectBtnText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  usbErrorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  usbErrorText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    lineHeight: 17,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  statusText: { flex: 1, gap: 2 },
  statusLabel: { fontSize: 15, fontFamily: "Inter_700Bold" },
  statusSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  readingTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  readingTagText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  parserCard: {
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  parserHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  parserTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveDot: { width: 5, height: 5, borderRadius: 2.5 },
  livePillText: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 0.8 },
  parserHint: { fontSize: 11, fontFamily: "Inter_400Regular" },
  parserRow: { flexDirection: "row", gap: 8 },
  parserInput: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  parseBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  parseMsg: { fontSize: 11, fontFamily: "Inter_500Medium" },
  rawTag: { borderRadius: 8, padding: 8 },
  rawTagText: { fontSize: 10, fontFamily: "Inter_400Regular", letterSpacing: 0.3 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  sensorList: { gap: 10 },
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 30,
    alignItems: "center",
    gap: 10,
  },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  creditsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  creditsHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  creditsIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  creditsTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  divider: { height: 1 },
  creditsHeading: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  creditsGrid: { gap: 10 },
  creditsRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  creditsRowText: { flex: 1, gap: 1 },
  creditsLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  creditsValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
