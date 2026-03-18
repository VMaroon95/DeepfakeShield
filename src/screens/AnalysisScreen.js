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
import MetadataSummary from '../components/MetadataSummary';
import ForensicReport from '../components/ForensicReport';

export default function AnalysisScreen({ route }) {
  const { analyze, result, status, reset, modelReady } = useDetection();
  const [mediaUri, setMediaUri] = useState(route?.params?.uri || null);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: Colors.onSurface, fontSize: 24, fontWeight: '800' }}>
              Analysis
            </Text>
            <View style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: modelReady ? '#1B372618' : Colors.primaryContainer + '40',
            }}>
              <Text style={{
                color: modelReady ? '#A8DAB5' : Colors.primary,
                fontSize: 11,
                fontWeight: '600',
              }}>
                {modelReady ? '🧠 Live Model' : '🎲 Simulation'}
              </Text>
            </View>
          </View>
          <Text style={{ color: Colors.outline, fontSize: 12, marginTop: 4 }}>
            On-device forensic deepfake detection
          </Text>
        </View>

        {/* Media preview */}
        {mediaUri && (
          <View style={{
            marginHorizontal: 16,
            marginTop: 12,
            borderRadius: 20,
            overflow: 'hidden',
            height: 220,
            backgroundColor: Colors.surfaceVar,
          }}>
            <Image
              source={{ uri: mediaUri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
            {/* Overlay gradient at bottom */}
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              backgroundColor: 'rgba(28, 27, 31, 0.6)',
              justifyContent: 'flex-end',
              paddingHorizontal: 16,
              paddingBottom: 12,
            }}>
              <Text style={{ color: Colors.onSurfaceVar, fontSize: 11 }}>
                📎 Source media • {result?.metadata?.sizeKB ? `${result.metadata.sizeKB} KB` : 'Analyzing...'}
              </Text>
            </View>
          </View>
        )}

        {/* ── IDLE STATE ── */}
        {status === 'idle' && (
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <View style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: Colors.surfaceVar,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 48 }}>🛡️</Text>
            </View>
            <Text style={{ color: Colors.onSurfaceVar, fontSize: 16, marginTop: 20, fontWeight: '500' }}>
              Ready to analyze
            </Text>
            <Text style={{ color: Colors.outline, fontSize: 13, marginTop: 6, textAlign: 'center', lineHeight: 20 }}>
              Pick an image or video, or share{'\n'}directly from any app
            </Text>
            <TouchableOpacity
              onPress={pickMedia}
              activeOpacity={0.85}
              style={{
                marginTop: 28,
                backgroundColor: Colors.primaryDark,
                borderRadius: 20,
                paddingHorizontal: 32,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18, marginRight: 10 }}>📂</Text>
              <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: '600' }}>
                Pick Media
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── LOADING STATE ── */}
        {status === 'loading' && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={{ color: Colors.onSurfaceVar, fontSize: 16, marginTop: 20, fontWeight: '500' }}>
              Running forensic analysis...
            </Text>
            <View style={{ marginTop: 16, alignItems: 'center' }}>
              {['Face boundary scan', 'Compression analysis', 'Frequency noise check', 'Lighting verification', 'Texture forensics', 'Metadata integrity'].map((step, i) => (
                <Text key={i} style={{ color: Colors.outline, fontSize: 12, marginTop: 6 }}>
                  {i < 3 ? '✓' : '○'} {step}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* ── RESULTS ── */}
        {status === 'done' && result && (
          <>
            <VerdictGauge score={result.score} />
            <ForensicBreakdown markers={result.markers} />
            <MetadataSummary result={result} />
            <ForensicReport result={result} />

            {/* Scan another */}
            <TouchableOpacity
              onPress={pickMedia}
              activeOpacity={0.85}
              style={{
                marginHorizontal: 16,
                backgroundColor: Colors.surfaceVar,
                borderRadius: 20,
                paddingVertical: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: Colors.outline + '20',
              }}
            >
              <Text style={{ fontSize: 16, marginRight: 8 }}>🔄</Text>
              <Text style={{ color: Colors.onSurfaceVar, fontSize: 14, fontWeight: '500' }}>
                Analyze Another
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── ERROR STATE ── */}
        {status === 'error' && (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 48 }}>⚠️</Text>
            <Text style={{ color: Colors.error, fontSize: 16, marginTop: 16, fontWeight: '500' }}>
              Analysis failed
            </Text>
            <Text style={{ color: Colors.outline, fontSize: 13, marginTop: 6 }}>
              Try a different image or video file
            </Text>
            <TouchableOpacity
              onPress={pickMedia}
              activeOpacity={0.85}
              style={{
                marginTop: 24,
                backgroundColor: Colors.surfaceVar,
                borderRadius: 20,
                paddingHorizontal: 28,
                paddingVertical: 14,
              }}
            >
              <Text style={{ color: Colors.onSurfaceVar, fontWeight: '500' }}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
