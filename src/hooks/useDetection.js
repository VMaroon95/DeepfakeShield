import { useState, useCallback } from 'react';

/**
 * useDetection — Forensic deepfake analysis hook.
 *
 * Takes a media URI, runs on-device forensic checks, returns structured results.
 * Currently uses heuristic simulation; swap with TFLite/CoreML model when ready.
 *
 * @returns {{ analyze, result, status, reset }}
 *   - analyze(uri: string): Promise<void>
 *   - result: { score, verdict, markers[], timestamp }
 *   - status: 'idle' | 'loading' | 'done' | 'error'
 */
export function useDetection() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);

  const analyze = useCallback(async (uri) => {
    setStatus('loading');
    setResult(null);

    try {
      // ── Forensic Analysis Pipeline ──
      // Phase 1: Frame extraction & face detection
      // Phase 2: Temporal consistency (blink rate, micro-expressions)
      // Phase 3: Lighting & edge artifact analysis
      // Phase 4: Audio-lip sync scoring (video only)
      //
      // TODO: Replace with actual TFLite inference:
      //   import { loadModel, runInference } from '../engine/TFLiteRunner';
      //   const model = await loadModel('deepfake_detector_v1.tflite');
      //   const raw = await runInference(model, frames);

      // Simulate processing delay (real model: 2-8 seconds)
      await new Promise((r) => setTimeout(r, 2500));

      // Simulated forensic markers — structure matches real model output
      const markers = [
        {
          id: 'face_consistency',
          label: 'Face Boundary Consistency',
          score: randomBetween(0.1, 0.95),
          weight: 0.25,
          detail: 'Checks for blending artifacts at face edges',
        },
        {
          id: 'lighting',
          label: 'Lighting & Shadow Analysis',
          score: randomBetween(0.1, 0.95),
          weight: 0.20,
          detail: 'Verifies lighting direction consistency across face regions',
        },
        {
          id: 'eye_blink',
          label: 'Eye-Blink Pattern Analysis',
          score: randomBetween(0.05, 0.90),
          weight: 0.20,
          detail: 'Deepfakes often have irregular or missing blink patterns',
        },
        {
          id: 'texture',
          label: 'Skin Texture Forensics',
          score: randomBetween(0.1, 0.95),
          weight: 0.15,
          detail: 'Detects AI-smoothed or inconsistent skin textures',
        },
        {
          id: 'lip_sync',
          label: 'Audio-Lip Sync Drift',
          score: randomBetween(0.05, 0.85),
          weight: 0.10,
          detail: 'Measures temporal alignment between speech audio and lip movement',
        },
        {
          id: 'compression',
          label: 'Compression Artifact Analysis',
          score: randomBetween(0.1, 0.90),
          weight: 0.10,
          detail: 'Identifies double-compression or GAN-specific noise patterns',
        },
      ];

      // Weighted composite score (0 = definitely real, 100 = definitely fake)
      const compositeScore = Math.round(
        markers.reduce((sum, m) => sum + m.score * m.weight, 0) * 100
      );

      const verdict =
        compositeScore <= 30 ? 'likely_real' :
        compositeScore <= 65 ? 'suspicious' :
        'likely_synthetic';

      setResult({
        score: compositeScore,
        verdict,
        markers: markers.map((m) => ({
          ...m,
          score: Math.round(m.score * 100),
          status: m.score < 0.3 ? 'pass' : m.score < 0.6 ? 'warn' : 'fail',
        })),
        uri,
        timestamp: new Date().toISOString(),
        modelVersion: 'heuristic-v0.1',
        processingMs: 2500,
      });

      setStatus('done');
    } catch (err) {
      console.error('Detection failed:', err);
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
  }, []);

  return { analyze, result, status, reset };
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
