"""TONIC live capture: stream the Windows default-output WASAPI loopback as s16le PCM.

PCM goes to stdout; metadata/logs go to stderr. No audio is written to disk.
Requires: PyAudioWPatch (see scripts/live-capture-requirements.txt).
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import threading

import pyaudiowpatch as pyaudio


def log(message: str) -> None:
    print(message, file=sys.stderr, flush=True)


def find_loopback(p: pyaudio.PyAudio, wanted: str) -> dict:
    wasapi = p.get_host_api_info_by_type(pyaudio.paWASAPI)
    default_output = p.get_device_info_by_index(wasapi["defaultOutputDevice"])
    loopbacks = list(p.get_loopback_device_info_generator())
    if not loopbacks:
        raise RuntimeError("Windows WASAPI 没有可用的 loopback 设备。")
    if wanted:
        try:
            index = int(wanted)
            for device in loopbacks:
                if device["index"] == index:
                    return device
        except ValueError:
            pass
        for device in loopbacks:
            if wanted.lower() in device["name"].lower():
                return device
        raise RuntimeError(f"找不到 loopback 设备：{wanted}")
    for device in loopbacks:
        if default_output["name"] in device["name"]:
            return device
    log(
        "WARN 未找到与默认输出同名的 loopback，改用第一个 loopback；"
        f"默认输出：{default_output['name']}"
    )
    return loopbacks[0]


def list_devices(p: pyaudio.PyAudio) -> None:
    wasapi = p.get_host_api_info_by_type(pyaudio.paWASAPI)
    default_output = p.get_device_info_by_index(wasapi["defaultOutputDevice"])
    devices = []
    for device in p.get_loopback_device_info_generator():
        devices.append(
            {
                "index": device["index"],
                "name": device["name"],
                "channels": device["maxInputChannels"],
                "sampleRate": device["defaultSampleRate"],
                "isDefault": default_output["name"] in device["name"],
            }
        )
    print(
        json.dumps(
            {
                "defaultOutput": default_output["name"],
                "devices": devices,
            },
            ensure_ascii=True,
            indent=2,
        )
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="TONIC WASAPI loopback capture")
    parser.add_argument("--list", action="store_true", help="list loopback devices and exit")
    parser.add_argument("--device", default="", help="loopback device index or name substring")
    parser.add_argument("--rate", type=int, default=0, help="sample rate; 0 = device default")
    parser.add_argument("--channels", type=int, default=2)
    parser.add_argument("--frames", type=int, default=1024)
    parser.add_argument("--watch-stdin", action="store_true")
    args = parser.parse_args()

    with pyaudio.PyAudio() as p:
        if args.list:
            list_devices(p)
            return 0

        if args.watch_stdin:
            def watch_parent() -> None:
                try:
                    sys.stdin.buffer.read(1)
                except Exception:
                    pass
                os._exit(0)

            threading.Thread(target=watch_parent, daemon=True).start()

        device = find_loopback(p, args.device)
        channels = max(1, min(args.channels, int(device["maxInputChannels"])))
        rate = args.rate or int(device["defaultSampleRate"] or 48000)
        meta = {
            "event": "start",
            "device": device["name"],
            "deviceIndex": device["index"],
            "rate": rate,
            "channels": channels,
            "frames": args.frames,
            "sampleFormat": "s16le",
        }
        log("TONIC_META " + json.dumps(meta, ensure_ascii=True))

        stream = p.open(
            format=pyaudio.paInt16,
            channels=channels,
            rate=rate,
            input=True,
            input_device_index=device["index"],
            frames_per_buffer=args.frames,
        )
        try:
            while True:
                data = stream.read(args.frames, exception_on_overflow=False)
                if data:
                    sys.stdout.buffer.write(data)
                    sys.stdout.buffer.flush()
        except KeyboardInterrupt:
            return 0
        except BrokenPipeError:
            return 0
        finally:
            stream.stop_stream()
            stream.close()


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        log(f"TONIC_ERROR {type(error).__name__}: {error}")
        raise SystemExit(1)
