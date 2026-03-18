# 🛡️ DeepfakeShield

**Shazam for Deepfakes — Detect AI-generated faces in media shared on any platform.**

> Share a suspicious video or image from WhatsApp, TikTok, Instagram, Facebook, OnlyFans, or any app → get an instant forensic verdict. 100% on-device, privacy-first.

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/VMaroon95/DeepfakeShield.git
cd DeepfakeShield

# Install dependencies
npm install

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android

# Dev mode (Expo Go)
npx expo start
```

## 🔍 How It Works

1. **Share** any image or video from any social media app to DeepfakeShield
2. **6 forensic checks** run entirely on your device:
   - Face Boundary Consistency
   - Lighting & Shadow Analysis
   - Eye-Blink Pattern Analysis
   - Skin Texture Forensics
   - Audio-Lip Sync Drift
   - Compression Artifact Analysis
3. **Get a verdict**: ✅ Likely Real / ⚠️ Suspicious / 🔴 Likely Synthetic
4. **Export & share** the forensic report back to any app

## 📱 Supported Platforms

Works with media from **any app** — including:

| Platform | Share Sheet | Direct Scan |
|----------|-----------|-------------|
| WhatsApp | ✅ | ✅ |
| TikTok | ✅ | ✅ |
| Instagram | ✅ | ✅ |
| Facebook | ✅ | ✅ |
| OnlyFans | ✅ | ✅ |
| Twitter/X | ✅ | ✅ |
| Telegram | ✅ | ✅ |
| Snapchat | ✅ | ✅ |

## 🔒 Privacy First

- **Zero data upload** — all analysis happens on your device
- **No accounts** — no sign-up, no tracking
- **No internet required** — works fully offline
- **Open source** — audit the code yourself

## 🏗️ Architecture

```
DeepfakeShield/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js         # Landing page
│   │   └── AnalysisScreen.js     # Main analysis UI
│   ├── components/
│   │   ├── VerdictGauge.js       # Circular confidence score
│   │   ├── ForensicBreakdown.js  # Individual marker cards
│   │   └── ForensicReport.js     # Exportable summary
│   ├── engine/
│   │   └── ShareHandler.js       # OS share sheet integration
│   ├── hooks/
│   │   └── useDetection.js       # Forensic analysis pipeline
│   └── utils/
│       └── colors.js             # Material You dark theme
├── App.js                        # Navigation + dark mode provider
└── app.json                      # Expo config + intent filters
```

## 🛣️ Roadmap

- [ ] TFLite/CoreML on-device model (FaceForensics++ trained)
- [ ] Video frame-by-frame analysis with timeline scrubber
- [ ] Creator Protection Mode (detect if YOUR face is being deepfaked)
- [ ] Reverse image search to find original source
- [ ] iOS Share Extension for seamless integration
- [ ] App Store & Play Store release

## Tech Stack

- **React Native** (Expo)
- **NativeWind** (Tailwind CSS for React Native)
- **React Native Reanimated** (smooth animations)
- **React Native SVG** (verdict gauge)
- **Expo Sharing / Image Picker / File System**

## License

MIT — see [LICENSE](LICENSE)

## Author

**Varun Meda** — [GitHub](https://github.com/VMaroon95) · [LinkedIn](https://linkedin.com/in/varunmeda1)
