/**
 * TFLiteRunner — Manages TFLite model loading and inference.
 *
 * Wraps react-native-fast-tflite for deepfake detection.
 * Output tensor: index 0 = Fake Probability (0.0 - 1.0)
 *
 * REQUIRES: Development build (not Expo Go).
 * Falls back gracefully if native module is unavailable.
 */

let loadTensorflowModel = null;
let modelInstance = null;
let loadFailed = false;

// Try to import — will fail in Expo Go (no native module)
try {
  const tflite = require('react-native-fast-tflite');
  loadTensorflowModel = tflite.loadTensorflowModel;
} catch (e) {
  console.log('[TFLiteRunner] Native module not available (Expo Go mode)');
  loadFailed = true;
}

/**
 * Check if TFLite is available (development build only).
 */
export function isTFLiteAvailable() {
  return !loadFailed && loadTensorflowModel !== null;
}

/**
 * Load the deepfake detection model.
 * @returns {boolean} true if loaded successfully
 */
export async function loadModel() {
  if (!isTFLiteAvailable()) {
    console.log('[TFLiteRunner] Skipping model load — native module unavailable');
    return false;
  }

  if (modelInstance) {
    console.log('[TFLiteRunner] Model already loaded');
    return true;
  }

  try {
    // Load from bundled assets
    // Place your .tflite file at: assets/models/deepfake_detector.tflite
    modelInstance = await loadTensorflowModel(
      require('../../assets/models/deepfake_detector.tflite'),
      'core-ml' // Use CoreML delegate on iOS for speed
    );
    console.log('[TFLiteRunner] Model loaded successfully');
    console.log('[TFLiteRunner] Input:', JSON.stringify(modelInstance.inputs));
    console.log('[TFLiteRunner] Output:', JSON.stringify(modelInstance.outputs));
    return true;
  } catch (err) {
    console.error('[TFLiteRunner] Model load failed:', err.message);
    loadFailed = true;
    return false;
  }
}

/**
 * Run inference on preprocessed image data.
 *
 * @param {Float32Array} inputData - Normalized pixel data (224*224*3 = 150528 floats)
 * @returns {{ fakeProbability: number, raw: number[] }} Model output
 */
export async function runInference(inputData) {
  if (!modelInstance) {
    throw new Error('Model not loaded. Call loadModel() first.');
  }

  try {
    const startMs = Date.now();

    // Run the model — input shape: [1, 224, 224, 3]
    const output = await modelInstance.run([inputData]);

    const elapsedMs = Date.now() - startMs;

    // Output tensor: index 0 = fake probability
    const fakeProbability = output[0][0];

    console.log(`[TFLiteRunner] Inference complete in ${elapsedMs}ms`);
    console.log(`[TFLiteRunner] Fake probability: ${fakeProbability.toFixed(4)}`);
    console.log(`[TFLiteRunner] Raw output:`, Array.from(output[0]).map(v => v.toFixed(4)));

    return {
      fakeProbability: fakeProbability,
      raw: Array.from(output[0]),
      inferenceMs: elapsedMs,
    };
  } catch (err) {
    console.error('[TFLiteRunner] Inference failed:', err.message);
    throw err;
  }
}

/**
 * Release the model from memory.
 */
export function unloadModel() {
  modelInstance = null;
  console.log('[TFLiteRunner] Model unloaded');
}
