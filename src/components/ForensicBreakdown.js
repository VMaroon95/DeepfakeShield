import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../utils/colors';

/**
 * ForensicBreakdown — Displays individual forensic analysis markers.
 *
 * @param {{ markers: Array<{ id, label, score, status, detail }> }} props
 */
export default function ForensicBreakdown({ markers = [] }) {
  return (
    <View className="mx-4 mt-2">
      <Text className="text-onSurfaceVar text-sm font-semibold tracking-wider mb-3 uppercase">
        Forensic Breakdown
      </Text>

      {markers.map((marker) => (
        <View
          key={marker.id}
          className="rounded-2xl mb-3 p-4"
          style={{ backgroundColor: Colors.surfaceVar }}
        >
          {/* Header row */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center flex-1">
              <StatusDot status={marker.status} />
              <Text
                className="text-onSurface font-medium ml-3 flex-1"
                numberOfLines={1}
              >
                {marker.label}
              </Text>
            </View>
            <ScorePill score={marker.score} status={marker.status} />
          </View>

          {/* Progress bar */}
          <View className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: Colors.surfaceHighest }}>
            <View
              className="h-full rounded-full"
              style={{
                width: `${marker.score}%`,
                backgroundColor: statusColor(marker.status),
              }}
            />
          </View>

          {/* Detail text */}
          <Text className="text-onSurfaceVar text-xs mt-2 opacity-70">
            {marker.detail}
          </Text>
        </View>
      ))}
    </View>
  );
}

function StatusDot({ status }) {
  return (
    <View
      className="w-2.5 h-2.5 rounded-full"
      style={{ backgroundColor: statusColor(status) }}
    />
  );
}

function ScorePill({ score, status }) {
  return (
    <View
      className="px-3 py-1 rounded-full"
      style={{ backgroundColor: statusColor(status) + '22' }}
    >
      <Text style={{ color: statusColor(status), fontSize: 13, fontWeight: '600' }}>
        {score}%
      </Text>
    </View>
  );
}

function statusColor(status) {
  switch (status) {
    case 'pass': return Colors.safe;
    case 'warn': return Colors.warning;
    case 'fail': return Colors.danger;
    default: return Colors.outline;
  }
}
