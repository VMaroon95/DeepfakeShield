import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { getVerdictColor } from '../utils/colors';

const SIZE = 200;
const STROKE_WIDTH = 12;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function VerdictGauge({ score = 0 }) {
  const animValue = useRef(new Animated.Value(0)).current;
  const verdict = getVerdictColor(score);

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: score / 100,
      duration: 1500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [score]);

  const strokeDashoffset = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <View style={{ alignItems: 'center', marginVertical: 24 }}>
      <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#2B2930"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={verdict.color}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <Text style={{ color: verdict.color, fontSize: 48, fontWeight: '700' }}>
            {score}
          </Text>
          <Text style={{ color: '#CAC4D0', fontSize: 14, marginTop: 4 }}>/ 100</Text>
        </View>
      </View>
      <View style={{ marginTop: 16, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 999, backgroundColor: verdict.bg }}>
        <Text style={{ color: verdict.color, fontSize: 16, fontWeight: '600' }}>
          {verdict.label}
        </Text>
      </View>
    </View>
  );
}
