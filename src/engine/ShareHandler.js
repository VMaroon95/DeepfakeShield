import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system';

/**
 * ShareHandler — Intercepts incoming media from the OS Share Sheet.
 *
 * When a user shares a video/image from WhatsApp, TikTok, Instagram, etc.,
 * this module captures the URI, validates the media type, copies it to
 * a local cache, and returns a normalized file path for the detection engine.
 *
 * Supported platforms: iOS (Share Extension), Android (Intent Filter)
 */

const SUPPORTED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/quicktime', 'video/webm', 'video/3gpp'],
};

const CACHE_DIR = `${FileSystem.cacheDirectory}deepfakeshield/`;

/**
 * Initialize the share handler — ensure cache directory exists.
 */
export async function initShareHandler() {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
}

/**
 * Handle an incoming shared URI.
 * @param {string} uri - The shared file URI
 * @param {string} [mimeType] - Optional MIME type hint
 * @returns {{ localUri, type, originalUri, sizeBytes }}
 */
export async function handleIncomingShare(uri, mimeType) {
  if (!uri) throw new Error('No URI provided');

  // Determine media type
  const type = getMediaType(uri, mimeType);
  if (!type) {
    throw new Error(`Unsupported media type. Supported: images and videos.`);
  }

  // Copy to local cache for safe processing
  const filename = `scan_${Date.now()}.${getExtension(uri, type)}`;
  const localUri = `${CACHE_DIR}${filename}`;

  await FileSystem.copyAsync({ from: uri, to: localUri });

  const info = await FileSystem.getInfoAsync(localUri);

  return {
    localUri,
    type, // 'image' | 'video'
    originalUri: uri,
    sizeBytes: info.size || 0,
    filename,
  };
}

/**
 * Parse initial URL when app is opened via share/deep link.
 */
export async function getInitialShare() {
  const url = await Linking.getInitialURL();
  if (url) {
    return handleIncomingShare(url);
  }
  return null;
}

/**
 * Clean up cached analysis files.
 */
export async function clearCache() {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
  if (dirInfo.exists) {
    await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
}

// ── Helpers ──

function getMediaType(uri, mimeType) {
  if (mimeType) {
    if (SUPPORTED_TYPES.image.includes(mimeType)) return 'image';
    if (SUPPORTED_TYPES.video.includes(mimeType)) return 'video';
  }
  const ext = uri.split('.').pop()?.toLowerCase().split('?')[0];
  const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  const videoExts = ['mp4', 'mov', 'webm', '3gp'];
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  return null;
}

function getExtension(uri, type) {
  const ext = uri.split('.').pop()?.toLowerCase().split('?')[0];
  if (ext && ext.length <= 5) return ext;
  return type === 'video' ? 'mp4' : 'jpg';
}
