import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../utils/colors';
import { useDetection } from '../hooks/useDetection';
import VerdictGauge from '../components/VerdictGauge';
import ForensicBreakdown from '../components/ForensicBreakdown';
import ForensicReport from '../components/ForensicReport';

export default function AnalysisScreen({ route }) {
  const { analyze, result, status, reset } = useDetection();
  const [mediaUri, setMediaUri] = useState(route?.params?.uri || null);

  // If opened via share sheet with a URI, auto-analyze
  useEffect(() => {
    if (mediaUri && status === 'idle') {
      analyze(mediaUri);
    }
  }, [mediaUri]);

  const pickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.8,
    });

    if (!picked.canceled && picked.assets?.[0]) {
      reset();
      const uri = picked.assets[0].uri;
      setMediaUri(uri);
      analyze(uri);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.surface }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text style={{ color: Colors.onSurface, fontSize: 22, fontWeight: '700' }}>
            Analysis
          </Text>
          <Text style={{ color: Colors.onSurfaceVar, fontSize: 13, marginTop: 4 }}>
            On-device forensic deepfake detection
          </Text>
        </View>

        {/* Media preview */}
        {mediaUri && (
          <View className="mx-4 mt-3 rounded-2xl overflow-hidden" style={{ height: 200 }}>
            <Image
              source={{ uri: mediaUri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        )}

        {/* States */}
        {status === 'idle' && (
          <View className="items-center mt-16">
            <Text style={{ fontSize: 56 }}>🛡️</Text>
            <Text className="mt-4" style={{ color: Colors.onSurfaceVar, fontSize: 15 }}>
              Select media to analyze
            </Text>
            <TouchableOpacity
              onPress={pickMedia}
              className="mt-6 rounded-2xl px-8 py-4"
              style={{ backgroundColor: Colors.primaryDark }}
              activeOpacity={0.85}
            >
              <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '600' }}>
                📂 Pick Image or Video
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {status === 'loading' && (
          <View className="items-center mt-16">
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text className="mt-4" style={{ color: Colors.onSurfaceVar, fontSize: 15 }}>
              Running forensic analysis...
            </Text>
            <Text className="mt-1" style={{ color: Colors.outline, fontSize: 12 }}>
              6 forensic checks • 100% on-device
            </Text>
          </View>
        )}

        {status === 'done' && result && (
          <>
            <VerdictGauge score={result.score} />
            <ForensicBreakdown markers={result.markers} />
            <ForensicReport result={result} />

            {/* Scan another */}
            <TouchableOpacity
              onPress={pickMedia}
              className="mx-4 mt-2 rounded-2xl py-4 items-center"
              style={{ backgroundColor: Colors.surfaceVar }}
              activeOpacity={0.85}
            >
              <Text style={{ color: Colors.onSurfaceVar, fontSize: 14, fontWeight: '500' }}>
                🔄 Analyze Another
              </Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'error' && (
          <View className="items-center mt-16">
            <Text style={{ fontSize: 48 }}>⚠️</Text>
            <Text className="mt-4" style={{ color: Colors.error, fontSize: 15 }}>
              Analysis failed. Try a different file.
            </Text>
            <TouchableOpacity
              onPress={pickMedia}
              className="mt-6 rounded-2xl px-8 py-4"
              style={{ backgroundColor: Colors.surfaceVar }}
              activeOpacity={0.85}
            >
              <Text style={{ color: Colors.onSurfaceVar }}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
