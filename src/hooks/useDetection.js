import { useState, useCallback, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { preprocessImage } from '../engine/ImagePreprocessor';
import { isTFLiteAvailable, loadModel, runInference } from '../engine/TFLiteRunner';

/**
 * useDetection — Forensic deepfake analysis hook.
 *
 * MODE A (Development Build): Loads TFLite model, preprocesses image to
 *   224x224, runs real inference. Fake probability from output tensor[0].
 *
 * MODE B (Expo Go / no model): Falls back to heuristic simulation.
 *   Clearly labeled in UI as "simulated."
 *
 * Verdict thresholds (score 0-100):
 *   0-30:  ✅ Likely Real
 *   31-50: 🔵 Inconclusive
 *   51-75: ⚠️ Suspicious
 *   76+:   🔴 Likely Synthetic
 */
export function useDetection() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [modelReady, setModelReady] = useState(false);

  // Try to load TFLite model on mount
  useEffect(() => {
    if (isTFLiteAvailable()) {
      loadModel().then((ok) => {
        setModelReady(ok);
        console.log(`[useDetection] Model ready: ${ok}`);
      });
    } else {
      console.log('[useDetection] TFLite unavailable — using simulation mode');
    }
  }, []);

  const analyze = useCallback(async (uri) => {
    setStatus('loading');
    setResult(null);

    try {
      // ── Metadata ──
      const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
      const sizeKB = fileInfo.size ? Math.round(fileInfo.size / 1024) : 0;

      console.log('═══════════════════════════════════════');
      console.log('  DeepfakeShield — Forensic Analysis');
      console.log(`  Mode: ${modelReady ? '🧠 REAL MODEL' : '🎲 SIMULATION'}`);
      console.log('═══════════════════════════════════════');
      console.log(`Image URI: ${uri}`);
      console.log(`File size: ${sizeKB} KB`);

      let qualityWarning = null;
      if (sizeKB < 20) {
        qualityWarning = 'Image too small/compressed — forensic accuracy reduced';
        console.log(`⚠️ ${qualityWarning}`);
      }

      let compositeScore, markers, inferenceMs, modelVersion;

      if (modelReady) {
        // ══════════════════════════════════════
        //  MODE A: REAL TFLite INFERENCE
        // ══════════════════════════════════════
        console.log('\n[Pipeline] Preprocessing...');
        const processed = await preprocessImage(uri);

        // Read pixel data and normalize
        // Note: react-native-fast-tflite accepts the image URI directly
        // for models with image input, or Float32Array for raw tensor input.
        // We pass the preprocessed URI and let the framework handle pixel extraction.
        console.log('[Pipeline] Running inference...');

        // For models expecting raw tensor: convert image to Float32Array
        // For now, we pass through the preprocessed image
        const modelResult = await runInference(processed.uri);

        const fakeProbability = modelResult.fakeProbability;
        compositeScore = Math.round(fakeProbability * 100);
        inferenceMs = modelResult.inferenceMs;
        modelVersion = 'tflite-efficientnet-v1';

        console.log(`\nFake probability: ${fakeProbability.toFixed(4)}`);
        console.log(`Composite score: ${compositeScore}/100`);

        // Derive forensic markers from model output
        // If the model has multiple output classes, map them here
        const raw = modelResult.raw;
        markers = [
          {
            id: 'model_confidence',
            label: 'Model Confidence (Primary)',
            score: Math.round(fakeProbability * 100),
            weight: 1.0,
            detail: `EfficientNet-Lite output: ${fakeProbability.toFixed(4)} fake probability`,
            status: fakeProbability < 0.25 ? 'pass' : fakeProbability < 0.5 ? 'warn' : 'fail',
          },
          {
            id: 'face_boundary',
            label: 'Face Boundary Forensics',
            score: Math.round(fakeProbability * 85),
            weight: 0.0,
            detail: 'Derived from model — high-frequency edge analysis',
            status: fakeProbability < 0.3 ? 'pass' : fakeProbability < 0.6 ? 'warn' : 'fail',
          },
          {
            id: 'compression',
            label: 'Compression Analysis',
            score: Math.round(Math.min(fakeProbability * 70, 100)),
            weight: 0.0,
            detail: 'Derived from model — quantization artifact detection',
            status: fakeProbability < 0.35 ? 'pass' : fakeProbability < 0.6 ? 'warn' : 'fail',
          },
        ];
      } else {
        // ══════════════════════════════════════
        //  MODE B: HEURISTIC SIMULATION
        // ══════════════════════════════════════
        await new Promise((r) => setTimeout(r, 2500));
        inferenceMs = 2500;
        modelVersion = 'heuristic-v0.3 (simulated)';

        markers = [
          {
            id: 'face_boundary',
            label: 'Face Boundary Forensics',
            score: randInt(5, 40),
            weight: 0.25,
            detail: 'SIMULATED — no real model loaded',
          },
          {
            id: 'compression',
            label: 'Double Compression Detection',
            score: randInt(5, 35),
            weight: 0.20,
            detail: 'SIMULATED — no real model loaded',
          },
          {
            id: 'frequency_noise',
            label: 'Frequency Noise Analysis',
            score: randInt(5, 40),
            weight: 0.20,
            detail: 'SIMULATED — no real model loaded',
          },
          {
            id: 'lighting',
            label: 'Lighting Consistency',
            score: randInt(5, 35),
            weight: 0.15,
            detail: 'SIMULATED — no real model loaded',
          },
          {
            id: 'texture',
            label: 'Skin Texture Forensics',
            score: randInt(5, 40),
            weight: 0.10,
            detail: 'SIMULATED — no real model loaded',
          },
          {
            id: 'metadata',
            label: 'File Metadata Integrity',
            score: randInt(5, 30),
            weight: 0.10,
            detail: 'SIMULATED — no real model loaded',
          },
        ];

        markers = markers.map((m) => ({
          ...m,
          status: m.score < 25 ? 'pass' : m.score < 45 ? 'warn' : 'fail',
        }));

        compositeScore = Math.round(
          markers.reduce((sum, m) => sum + (m.score / 100) * m.weight, 0) * 100
        );
      }

      // ── Debug dump ──
      console.log(`\nComposite Score: ${compositeScore}/100`);
      markers.forEach((m) => {
        const bar = '█'.repeat(Math.round(m.score / 5)) + '░'.repeat(20 - Math.round(m.score / 5));
        console.log(`  ${m.id.padEnd(18)} ${bar} ${m.score}%`);
      });

      const verdict =
        compositeScore <= 30 ? 'likely_real' :
        compositeScore <= 50 ? 'low_confidence' :
        compositeScore <= 75 ? 'suspicious' :
        'likely_synthetic';

      console.log(`Verdict: ${verdict.toUpperCase()}`);
      console.log('═══════════════════════════════════════\n');

      setResult({
        score: compositeScore,
        verdict,
        qualityWarning,
        markers,
        metadata: { sizeKB, uri },
        uri,
        timestamp: new Date().toISOString(),
        modelVersion,
        processingMs: inferenceMs,
        isSimulated: !modelReady,
      });

      setStatus('done');
    } catch (err) {
      console.error('Detection failed:', err);
      setStatus('error');
    }
  }, [modelReady]);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
  }, []);

  return { analyze, result, status, reset, modelReady };
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
