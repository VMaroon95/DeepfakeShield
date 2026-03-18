import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../utils/colors';

const MINI_SIZE = 36;
const MINI_STROKE = 3;
const MINI_RADIUS = (MINI_SIZE - MINI_STROKE) / 2;
const MINI_CIRC = 2 * Math.PI * MINI_RADIUS;

export default function ForensicBreakdown({ markers = [] }) {
  return (
    <View style={{ marginHorizontal: 16, marginTop: 24 }}>
      {/* Section header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: Colors.primary, marginRight: 10 }} />
        <Text style={{ color: Colors.onSurfaceVar, fontSize: 12, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
          Forensic Evidence
        </Text>
      </View>

      {markers.map((marker, i) => (
        <View
          key={marker.id}
          style={{
            backgroundColor: Colors.surfaceVar,
            borderRadius: 20,
            padding: 16,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: statusBorderColor(marker.status),
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Mini gauge */}
            <View style={{ width: MINI_SIZE, height: MINI_SIZE, marginRight: 14 }}>
              <Svg width={MINI_SIZE} height={MINI_SIZE}>
                <Circle
                  cx={MINI_SIZE / 2}
                  cy={MINI_SIZE / 2}
                  r={MINI_RADIUS}
                  stroke={Colors.surfaceHighest}
                  strokeWidth={MINI_STROKE}
                  fill="none"
                />
                <Circle
                  cx={MINI_SIZE / 2}
                  cy={MINI_SIZE / 2}
                  r={MINI_RADIUS}
                  stroke={statusColor(marker.status)}
                  strokeWidth={MINI_STROKE}
                  fill="none"
                  strokeDasharray={MINI_CIRC}
                  strokeDashoffset={MINI_CIRC * (1 - marker.score / 100)}
                  strokeLinecap="round"
                  rotation="-90"
                  origin={`${MINI_SIZE / 2}, ${MINI_SIZE / 2}`}
                />
              </Svg>
              <View style={{ position: 'absolute', width: MINI_SIZE, height: MINI_SIZE, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: statusColor(marker.status), fontSize: 10, fontWeight: '700' }}>
                  {marker.score}
                </Text>
              </View>
            </View>

            {/* Label + score */}
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.onSurface, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
                {marker.label}
              </Text>
              <Text style={{ color: Colors.outline, fontSize: 11, marginTop: 2 }}>
                {marker.detail}
              </Text>
            </View>

            {/* Status badge */}
            <View style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: statusColor(marker.status) + '18',
              marginLeft: 8,
            }}>
              <Text style={{ color: statusColor(marker.status), fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
                {statusLabel(marker.status)}
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: Colors.surfaceHighest,
            marginTop: 12,
            overflow: 'hidden',
          }}>
            <View style={{
              width: `${marker.score}%`,
              height: '100%',
              borderRadius: 2,
              backgroundColor: statusColor(marker.status),
            }} />
          </View>
        </View>
      ))}
    </View>
  );
}

function statusColor(status) {
  switch (status) {
    case 'pass': return '#A8DAB5';
    case 'warn': return '#FFD599';
    case 'fail': return '#FFB4AB';
    default: return Colors.outline;
  }
}

function statusBorderColor(status) {
  switch (status) {
    case 'pass': return '#A8DAB510';
    case 'warn': return '#FFD59915';
    case 'fail': return '#FFB4AB20';
    default: return 'transparent';
  }
}

function statusLabel(status) {
  switch (status) {
    case 'pass': return 'Clear';
    case 'warn': return 'Review';
    case 'fail': return 'Alert';
    default: return '—';
  }
}
