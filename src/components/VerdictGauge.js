import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { getVerdictColor } from '../utils/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 200;
const STROKE_WIDTH = 12;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * VerdictGauge — Circular progress indicator showing synthetic confidence score.
 *
 * @param {{ score: number }} props - Score 0-100 (0 = real, 100 = synthetic)
 */
export default function VerdictGauge({ score = 0 }) {
  const progress = useSharedValue(0);
  const verdict = getVerdictColor(score);

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1500,
      easing: Easing.bezierFn(0.4, 0, 0.2, 1),
    });
  }, [score]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <View className="items-center my-6">
      <View className="relative items-center justify-center">
        <Svg width={SIZE} height={SIZE}>
          {/* Background track */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#2B2930"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* Animated progress arc */}
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={verdict.color}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps}
            strokeLinecap="round"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>

        {/* Center content */}
        <View className="absolute items-center">
          <Text style={{ color: verdict.color, fontSize: 48, fontWeight: '700' }}>
            {score}
          </Text>
          <Text className="text-onSurfaceVar text-sm mt-1">/ 100</Text>
        </View>
      </View>

      {/* Verdict label */}
      <View
        className="mt-4 px-6 py-2 rounded-full"
        style={{ backgroundColor: verdict.bg }}
      >
        <Text style={{ color: verdict.color, fontSize: 16, fontWeight: '600' }}>
          {verdict.label}
        </Text>
      </View>
    </View>
  );
}
