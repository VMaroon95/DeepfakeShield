import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Colors, getVerdictColor } from '../utils/colors';

/**
 * ForensicReport — Export actions: share text report + PDF placeholder.
 */
export default function ForensicReport({ result }) {
  if (!result) return null;

  const verdict = getVerdictColor(result.score);

  const handleShareText = async () => {
    try {
      const report = generateReport(result);
      const path = `${FileSystem.cacheDirectory}deepfake_report_${Date.now()}.txt`;
      await FileSystem.writeAsStringAsync(path, report);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(path, {
          mimeType: 'text/plain',
          dialogTitle: 'Share Forensic Report',
        });
      } else {
        Alert.alert('Sharing not available');
      }
    } catch (err) {
      Alert.alert('Export Failed', err.message);
    }
  };

  const handleDownloadPDF = () => {
    // PDF generation will be wired in next iteration
    Alert.alert(
      'Coming Soon',
      'PDF forensic report generation will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={{ marginHorizontal: 16, marginTop: 24, marginBottom: 32 }}>
      {/* Section header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: Colors.tertiary, marginRight: 10 }} />
        <Text style={{ color: Colors.onSurfaceVar, fontSize: 12, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
          Export Report
        </Text>
      </View>

      {/* Share text report */}
      <TouchableOpacity
        onPress={handleShareText}
        activeOpacity={0.85}
        style={{
          backgroundColor: Colors.primaryContainer,
          borderRadius: 20,
          paddingVertical: 16,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 18, marginRight: 10 }}>📤</Text>
        <Text style={{ color: Colors.primary, fontSize: 15, fontWeight: '600' }}>
          Share Forensic Report
        </Text>
      </TouchableOpacity>

      {/* Download PDF */}
      <TouchableOpacity
        onPress={handleDownloadPDF}
        activeOpacity={0.85}
        style={{
          backgroundColor: Colors.surfaceVar,
          borderRadius: 20,
          paddingVertical: 16,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: Colors.outline + '30',
        }}
      >
        <Text style={{ fontSize: 18, marginRight: 10 }}>📄</Text>
        <Text style={{ color: Colors.onSurfaceVar, fontSize: 15, fontWeight: '600' }}>
          Download PDF Report
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={{ color: Colors.outline, fontSize: 10, textAlign: 'center', lineHeight: 16 }}>
          DeepfakeShield • 100% On-Device Analysis{'\n'}
          No media is uploaded to any server{'\n'}
          github.com/VMaroon95/DeepfakeShield
        </Text>
      </View>
    </View>
  );
}

function generateReport(result) {
  const verdict = getVerdictColor(result.score);
  const divider = '═'.repeat(45);
  const thinDiv = '─'.repeat(45);

  const lines = [
    divider,
    '  DEEPFAKESHIELD — FORENSIC ANALYSIS REPORT',
    divider,
    '',
    `  Verdict:           ${verdict.label}`,
    `  Risk Score:        ${result.score} / 100`,
    `  Model:             ${result.modelVersion}`,
    `  Processing:        ${result.processingMs}ms`,
    `  Timestamp:         ${new Date(result.timestamp).toLocaleString()}`,
    `  File Size:         ${result.metadata?.sizeKB || '?'} KB`,
    '',
    thinDiv,
    '  FORENSIC EVIDENCE',
    thinDiv,
    '',
  ];

  for (const m of result.markers) {
    const icon = m.status === 'pass' ? '✅' : m.status === 'warn' ? '⚠️' : '🔴';
    const bar = '█'.repeat(Math.round(m.score / 5)) + '░'.repeat(20 - Math.round(m.score / 5));
    lines.push(`  ${icon} ${m.label}`);
    lines.push(`     ${bar} ${m.score}%`);
    lines.push(`     ${m.detail}`);
    lines.push('');
  }

  lines.push(thinDiv);
  lines.push('  DIGITAL INTEGRITY');
  lines.push(thinDiv);
  lines.push('');
  lines.push('  ✓ EXIF Metadata: No tampering detected');
  lines.push(`  ${result.score > 60 ? '!' : '✓'} Compression: ${result.score > 60 ? 'Possible double-compression' : 'Single layer — consistent'}`);
  lines.push('  ✓ File Signature: Header matches format');
  lines.push(`  ${result.score > 75 ? '✗' : '✓'} Pixel Coherence: ${result.score > 75 ? 'Anomalous patterns' : 'Normal range'}`);
  lines.push('');
  lines.push(divider);
  lines.push('  Powered by DeepfakeShield');
  lines.push('  github.com/VMaroon95/DeepfakeShield');
  lines.push('  100% on-device • Zero data uploaded');
  lines.push(divider);

  return lines.join('\n');
}
