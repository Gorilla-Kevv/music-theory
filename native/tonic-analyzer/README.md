# TONIC Analyzer CLAP

Headless CLAP effect that taps an FL Studio Mixer Insert (Master or any track), passes audio through unchanged, and streams it to the TONIC bridge for real-time analysis.

## Why CLAP

FL Studio does not expose mixer audio to external processes. Inserting a plug-in on the mixer is the only direct, per-track/master tap. The plug-in is a pass-through; analysis stays in TONIC's local bridge.

Y2Kmeter is a GPL-3.0 JUCE project without a public API; it is used only as a feature reference. This plug-in is an independent implementation using the MIT-licensed CLAP headers.

## Signal path

```text
FL Mixer Insert (Master or track)
  └─ TONIC-Analyzer.clap (pass-through)
       └─ 127.0.0.1:5128 / TONIC1 <rate> <channels> + f32le frames
            └─ scripts/plugin-live.ts
                 └─ scripts/live-analyze.ts → TONIC panel (/api/live/status)
```

## Build

```bat
native\tonic-analyzer\build.bat
```

The script fetches CLAP headers if missing, then uses MinGW `g++` when available, otherwise MSVC. Output:

```text
native\tonic-analyzer\TONIC-Analyzer.clap
```

## Install

FL Studio 2026 scans **`C:\Program Files\Common Files\CLAP\`**; its plugin-manager log does not include the per-user CLAP directory. Install there:

1. Right-click `native\tonic-analyzer\install.bat` → **Run as administrator**.
2. In FL Studio: **Options → Manage plugins**.
3. Click **Verify plugins / Scan**; enable **TONIC Analyzer** if it is unchecked.
4. Insert **TONIC Analyzer** on Master or any Mixer Insert effect slot.
5. Open the TONIC panel → FL → LIVE ANALYSIS. Source should read `FL Mixer CLAP`.

If scan still misses it, use **Ctrl+click Scan** for a full scan and check the Plugin Manager **Blacklist**.

## Notes

- The plug-in is x64 and CLAP-only (no VST3/AU).
- It does not modify audio, add latency, or write files.
- If the bridge is not running it reconnects every 2 seconds; audio is unaffected.
- The bridge keeps a 5-second in-memory ring buffer for analysis only.
