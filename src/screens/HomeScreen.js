import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../utils/colors';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.surface }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        {/* Logo area */}
        <View className="items-center mb-10">
          <Text style={{ fontSize: 64 }}>🛡️</Text>
          <Text
            className="mt-4 text-center"
            style={{ color: Colors.onSurface, fontSize: 28, fontWeight: '700' }}
          >
            DeepfakeShield
          </Text>
          <Text
            className="mt-2 text-center"
            style={{ color: Colors.onSurfaceVar, fontSize: 15, lineHeight: 22 }}
          >
            Detect deepfakes in media shared on{'\n'}
            WhatsApp, TikTok, Instagram & more
          </Text>
        </View>

        {/* Features list */}
        <View className="mb-10">
          <FeatureRow icon="🔍" text="Share any image or video → get instant verdict" />
          <FeatureRow icon="📱" text="Works with all social media platforms" />
          <FeatureRow icon="🔒" text="100% on-device — nothing leaves your phone" />
          <FeatureRow icon="⚡" text="Results in under 5 seconds" />
        </View>

        {/* Primary CTA */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Analysis')}
          className="rounded-2xl py-4 items-center mb-4"
          style={{ backgroundColor: Colors.primaryDark }}
          activeOpacity={0.85}
        >
          <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '600' }}>
            📂 Pick Media to Analyze
          </Text>
        </TouchableOpacity>

        {/* Secondary */}
        <TouchableOpacity
          className="rounded-2xl py-4 items-center"
          style={{ backgroundColor: Colors.surfaceVar }}
          activeOpacity={0.85}
        >
          <Text style={{ color: Colors.onSurfaceVar, fontSize: 14 }}>
            Or share directly from any app →  DeepfakeShield
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text className="text-center mt-8" style={{ color: Colors.outline, fontSize: 12 }}>
          v1.0.0 • Privacy-first • No data uploaded{'\n'}
          github.com/VMaroon95/DeepfakeShield
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureRow({ icon, text }) {
  return (
    <View className="flex-row items-center mb-4">
      <Text style={{ fontSize: 20, marginRight: 14 }}>{icon}</Text>
      <Text style={{ color: Colors.onSurfaceVar, fontSize: 14, flex: 1 }}>{text}</Text>
    </View>
  );
}
