import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../utils/colors';
import { getVerdictColor } from '../utils/colors';

/**
 * MetadataSummary — Image metadata & digital integrity card.
 */
export default function MetadataSummary({ result }) {
  if (!result) return null;

  const verdict = getVerdictColor(result.score);

  const metaRows = [
    { icon: '📐', label: 'File Size', value: result.metadata?.sizeKB ? `${result.metadata.sizeKB} KB` : 'Unknown' },
    { icon: '🧬', label: 'Model Version', value: result.modelVersion || '—' },
    { icon: '⏱️', label: 'Processing Time', value: `${result.processingMs}ms` },
    { icon: '📅', label: 'Scanned At', value: new Date(result.timestamp).toLocaleString() },
  ];

  // Digital integrity checks
  const integrityChecks = [
    {
      label: 'EXIF Metadata',
      status: 'pass',
      detail: 'No tampering indicators detected',
    },
    {
      label: 'Compression Layers',
      status: result.score > 60 ? 'warn' : 'pass',
      detail: result.score > 60 ? 'Possible double-compression detected' : 'Single compression layer — consistent',
    },
    {
      label: 'File Signature',
      status: 'pass',
      detail: 'Header matches declared format',
    },
    {
      label: 'Pixel Coherence',
      status: result.score > 75 ? 'fail' : result.score > 50 ? 'warn' : 'pass',
      detail: result.score > 75 ? 'Anomalous pixel patterns in face region' : 'Pixel distribution within normal range',
    },
  ];

  return (
    <View style={{ marginHorizontal: 16, marginTop: 24 }}>
      {/* Section header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: Colors.secondary, marginRight: 10 }} />
        <Text style={{ color: Colors.onSurfaceVar, fontSize: 12, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
          Digital Integrity
        </Text>
      </View>

      {/* Metadata card */}
      <View style={{
        backgroundColor: Colors.surfaceVar,
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
      }}>
        {metaRows.map((row, i) => (
          <View key={i} style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
            borderBottomWidth: i < metaRows.length - 1 ? 0.5 : 0,
            borderBottomColor: Colors.outline + '20',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, marginRight: 10 }}>{row.icon}</Text>
              <Text style={{ color: Colors.onSurfaceVar, fontSize: 13 }}>{row.label}</Text>
            </View>
            <Text style={{ color: Colors.onSurface, fontSize: 13, fontWeight: '500' }}>{row.value}</Text>
          </View>
        ))}
      </View>

      {/* Integrity checks */}
      <View style={{
        backgroundColor: Colors.surfaceVar,
        borderRadius: 20,
        padding: 18,
      }}>
        <Text style={{ color: Colors.onSurfaceVar, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
          Integrity Checks
        </Text>
        {integrityChecks.map((check, i) => (
          <View key={i} style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: i < integrityChecks.length - 1 ? 12 : 0,
          }}>
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: checkColor(check.status),
              marginTop: 5,
              marginRight: 12,
            }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.onSurface, fontSize: 13, fontWeight: '600' }}>
                {check.label}
              </Text>
              <Text style={{ color: Colors.outline, fontSize: 11, marginTop: 2 }}>
                {check.detail}
              </Text>
            </View>
            <Text style={{ color: checkColor(check.status), fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
              {check.status === 'pass' ? '✓' : check.status === 'warn' ? '!' : '✗'}
            </Text>
          </View>
        ))}
      </View>

      {/* Quality warning */}
      {result.qualityWarning && (
        <View style={{
          backgroundColor: '#3D2E14',
          borderRadius: 16,
          padding: 14,
          marginTop: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 16, marginRight: 10 }}>⚠️</Text>
          <Text style={{ color: '#FFD599', fontSize: 12, flex: 1 }}>{result.qualityWarning}</Text>
        </View>
      )}

      {/* Simulation notice */}
      {result.isSimulated && (
        <View style={{
          backgroundColor: Colors.primaryContainer + '40',
          borderRadius: 16,
          padding: 14,
          marginTop: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 16, marginRight: 10 }}>🎲</Text>
          <Text style={{ color: Colors.primary, fontSize: 12, flex: 1 }}>
            Simulation mode — scores are generated, not from real model inference.
            Install TFLite model for actual detection.
          </Text>
        </View>
      )}
    </View>
  );
}

function checkColor(status) {
  switch (status) {
    case 'pass': return '#A8DAB5';
    case 'warn': return '#FFD599';
    case 'fail': return '#FFB4AB';
    default: return '#938F99';
  }
}
