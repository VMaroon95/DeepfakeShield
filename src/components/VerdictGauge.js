import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { getVerdictColor } from '../utils/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 220;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function VerdictGauge({ score = 0 }) {
  const animValue = useRef(new Animated.Value(0)).current;
  const verdict = getVerdictColor(score);

  useEffect(() => {
    animValue.setValue(0);
    Animated.timing(animValue, {
      toValue: score / 100,
      duration: 1800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    }).start();
  }, [score]);

  const strokeDashoffset = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 8 }}>
      {/* Outer glow ring */}
      <View style={{
        width: SIZE + 24,
        height: SIZE + 24,
        borderRadius: (SIZE + 24) / 2,
        backgroundColor: verdict.bg,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: verdict.color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 12,
      }}>
        <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={SIZE} height={SIZE}>
            <Defs>
              <LinearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={verdict.color} stopOpacity="1" />
                <Stop offset="1" stopColor={verdict.color} stopOpacity="0.5" />
              </LinearGradient>
            </Defs>
            {/* Track */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#2B293044"
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            {/* Progress */}
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="url(#gaugeGrad)"
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${SIZE / 2}, ${SIZE / 2}`}
            />
          </Svg>

          {/* Center */}
          <View style={{ position: 'absolute', alignItems: 'center' }}>
            <Text style={{ color: '#938F99', fontSize: 11, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
              Risk Score
            </Text>
            <Text style={{ color: verdict.color, fontSize: 56, fontWeight: '800', lineHeight: 60 }}>
              {score}
            </Text>
            <Text style={{ color: '#938F99', fontSize: 13, marginTop: 2 }}>out of 100</Text>
          </View>
        </View>
      </View>

      {/* Verdict pill */}
      <View style={{
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 100,
        backgroundColor: verdict.bg,
        borderWidth: 1,
        borderColor: verdict.color + '33',
      }}>
        <Text style={{ color: verdict.color, fontSize: 15, fontWeight: '700', letterSpacing: 0.5 }}>
          {verdict.label}
        </Text>
      </View>
    </View>
  );
}
