import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Colors } from '../utils/colors';
import { getVerdictColor } from '../utils/colors';

/**
 * ForensicReport — Exportable summary card + share button.
 *
 * Generates a plain-text forensic report and shares it via the OS share sheet,
 * allowing users to send results back to WhatsApp, save to Files, etc.
 */
export default function ForensicReport({ result }) {
  if (!result) return null;

  const verdict = getVerdictColor(result.score);

  const handleExport = async () => {
    try {
      const report = generateReport(result);
      const path = `${FileSystem.cacheDirectory}deepfake_report_${Date.now()}.txt`;
      await FileSystem.writeAsStringAsync(path, report);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(path, {
          mimeType: 'text/plain',
          dialogTitle: 'Share DeepfakeShield Report',
        });
      } else {
        Alert.alert('Sharing not available on this device');
      }
    } catch (err) {
      Alert.alert('Export Failed', err.message);
    }
  };

  return (
    <View className="mx-4 mt-4 mb-8">
      {/* Summary card */}
      <View
        className="rounded-2xl p-5 mb-4"
        style={{ backgroundColor: Colors.surfaceVar }}
      >
        <Text className="text-onSurfaceVar text-sm font-semibold tracking-wider uppercase mb-3">
          Analysis Summary
        </Text>

        <Row label="Verdict" value={verdict.label} valueColor={verdict.color} />
        <Row label="Confidence Score" value={`${result.score}/100`} />
        <Row label="Model" value={result.modelVersion} />
        <Row label="Processing Time" value={`${result.processingMs}ms`} />
        <Row label="Analyzed At" value={new Date(result.timestamp).toLocaleString()} />

        <View className="mt-3 pt-3" style={{ borderTopWidth: 0.5, borderTopColor: Colors.outline + '40' }}>
          <Text className="text-onSurfaceVar text-xs opacity-60">
            Results are probabilistic. DeepfakeShield uses on-device forensic analysis.
            No media is uploaded to any server.
          </Text>
        </View>
      </View>

      {/* Export button */}
      <TouchableOpacity
        onPress={handleExport}
        className="rounded-2xl py-4 items-center"
        style={{ backgroundColor: Colors.primaryContainer }}
        activeOpacity={0.8}
      >
        <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '600' }}>
          📤 Export & Share Report
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <View className="flex-row justify-between items-center py-1.5">
      <Text className="text-onSurfaceVar text-sm">{label}</Text>
      <Text
        className="text-sm font-medium"
        style={{ color: valueColor || Colors.onSurface }}
      >
        {value}
      </Text>
    </View>
  );
}

function generateReport(result) {
  const verdict = getVerdictColor(result.score);
  const lines = [
    '═══════════════════════════════════════',
    '  DEEPFAKESHIELD — FORENSIC REPORT',
    '═══════════════════════════════════════',
    '',
    `  Verdict:          ${verdict.label}`,
    `  Confidence Score: ${result.score}/100`,
    `  Model Version:    ${result.modelVersion}`,
    `  Processing Time:  ${result.processingMs}ms`,
    `  Analyzed At:      ${new Date(result.timestamp).toLocaleString()}`,
    '',
    '───────────────────────────────────────',
    '  FORENSIC MARKERS',
    '───────────────────────────────────────',
    '',
  ];

  for (const m of result.markers) {
    const icon = m.status === 'pass' ? '✅' : m.status === 'warn' ? '⚠️' : '🔴';
    lines.push(`  ${icon} ${m.label}: ${m.score}%`);
    lines.push(`     ${m.detail}`);
    lines.push('');
  }

  lines.push('───────────────────────────────────────');
  lines.push('  Powered by DeepfakeShield');
  lines.push('  github.com/VMaroon95/DeepfakeShield');
  lines.push('  100% on-device • Privacy-first');
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}
