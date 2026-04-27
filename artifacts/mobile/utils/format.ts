import type { WaterQualityStatus } from "../types";

export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return date.toLocaleDateString();
}

export function formatValue(value: number, unit: string): string {
  if (unit === "pH") return value.toFixed(1);
  if (unit === "NTU") return value.toFixed(2);
  if (unit === "°C") return value.toFixed(1);
  return value.toFixed(1);
}

export function statusLabel(status: WaterQualityStatus): string {
  switch (status) {
    case "good": return "Good";
    case "moderate": return "Moderate";
    case "poor": return "Poor";
    default: return "Unknown";
  }
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}
