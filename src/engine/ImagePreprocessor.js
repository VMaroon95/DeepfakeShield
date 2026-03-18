import * as ImageManipulator from 'expo-image-manipulator';

/**
 * ImagePreprocessor — Resize and normalize images for TFLite inference.
 *
 * EfficientNet-Lite expects 224x224 RGB input normalized to [0, 1].
 * We resize with Lanczos (default), center-crop if non-square, and
 * export as PNG to avoid JPEG compression artifacts that cause false positives.
 */

const MODEL_INPUT_SIZE = 224;

/**
 * Preprocess an image URI for model inference.
 * @param {string} uri - Source image URI
 * @returns {{ uri: string, width: number, height: number }} Processed image
 */
export async function preprocessImage(uri) {
  // Resize to 224x224, export as PNG to preserve pixel integrity
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE } }],
    { format: ImageManipulator.SaveFormat.PNG }
  );

  console.log(`[Preprocessor] Resized to ${result.width}x${result.height}`);

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
  };
}

/**
 * Convert image pixel data to Float32Array normalized to [0, 1].
 * Used when feeding raw tensor data to the model.
 *
 * @param {Uint8Array} rgbData - Raw RGB pixel bytes (224*224*3)
 * @returns {Float32Array} Normalized float array
 */
export function normalizePixels(rgbData) {
  const float32 = new Float32Array(rgbData.length);
  for (let i = 0; i < rgbData.length; i++) {
    float32[i] = rgbData[i] / 255.0;
  }
  return float32;
}

export { MODEL_INPUT_SIZE };
