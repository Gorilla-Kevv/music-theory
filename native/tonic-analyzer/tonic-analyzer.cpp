// TONIC Analyzer: a headless CLAP pass-through that streams FL mixer audio to the TONIC bridge.
// Independent implementation; CLAP headers are MIT licensed. No Y2Kmeter source is copied.

#define WIN32_LEAN_AND_MEAN
#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0601
#endif
#include <winsock2.h>
#include <ws2tcpip.h>

#include <algorithm>
#include <atomic>
#include <chrono>
#include <cmath>
#include <cstdint>
#include <cstring>
#include <string>
#include <thread>
#include <vector>

#include <clap/clap.h>
#include <clap/ext/audio-ports.h>

namespace {

constexpr uint16_t kBridgePort = 5128;
constexpr uint32_t kMagic = 0x434E4F54; // bytes "TONC" on little-endian
constexpr uint32_t kMaxFrames = 384000; // 2 s at 192 kHz
constexpr uint32_t kChannels = 2;
constexpr uint32_t kSendFrames = 1024;

class AudioRing {
 public:
  AudioRing() : data_(static_cast<size_t>(kMaxFrames) * kChannels, 0.0f) {}

  void clear() {
    write_.store(0, std::memory_order_relaxed);
    read_.store(0, std::memory_order_relaxed);
  }

  void push(const clap_audio_buffer_t &input, uint32_t frames) {
    uint64_t write = write_.load(std::memory_order_relaxed);
    const uint64_t read = read_.load(std::memory_order_acquire);
    const uint64_t freeFrames = kMaxFrames - (write - read);
    if (frames > freeFrames) return;
    const uint32_t channels = std::min<uint32_t>(input.channel_count, kChannels);
    for (uint32_t frame = 0; frame < frames; ++frame) {
      const size_t base = static_cast<size_t>((write + frame) % kMaxFrames) * kChannels;
      for (uint32_t channel = 0; channel < kChannels; ++channel) {
        float value = 0.0f;
        if (channel < channels) {
          if (input.data32 && input.data32[channel]) {
            value = input.data32[channel][frame];
          } else if (input.data64 && input.data64[channel]) {
            value = static_cast<float>(input.data64[channel][frame]);
          }
        } else if (channels == 1) {
          if (input.data32 && input.data32[0]) value = input.data32[0][frame];
          else if (input.data64 && input.data64[0]) value = static_cast<float>(input.data64[0][frame]);
        }
        data_[base + channel] = value;
      }
    }
    write_.store(write + frames, std::memory_order_release);
  }

  uint32_t pop(float *destination, uint32_t maxFrames) {
    const uint64_t read = read_.load(std::memory_order_relaxed);
    const uint64_t write = write_.load(std::memory_order_acquire);
    const uint32_t frames = static_cast<uint32_t>(std::min<uint64_t>(maxFrames, write - read));
    if (frames == 0) return 0;
    for (uint32_t frame = 0; frame < frames; ++frame) {
      const size_t source = static_cast<size_t>((read + frame) % kMaxFrames) * kChannels;
      destination[frame * kChannels] = data_[source];
      destination[frame * kChannels + 1] = data_[source + 1];
    }
    read_.store(read + frames, std::memory_order_release);
    return frames;
  }

 private:
  std::vector<float> data_;
  std::atomic<uint64_t> write_{0};
  std::atomic<uint64_t> read_{0};
};

struct TonicPlugin {
  clap_plugin_t plugin{};
  const clap_host_t *host = nullptr;
  AudioRing ring;
  std::thread sender;
  std::atomic<bool> running{false};
  std::atomic<double> sampleRate{48000.0};
  std::atomic<bool> reconnect{false};
};

bool sendAll(SOCKET socket, const void *data, size_t size) {
  const char *cursor = static_cast<const char *>(data);
  while (size > 0) {
    const int sent = send(socket, cursor, static_cast<int>(size), 0);
    if (sent <= 0) return false;
    cursor += sent;
    size -= static_cast<size_t>(sent);
  }
  return true;
}

SOCKET connectBridge() {
  SOCKET socket = ::socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
  if (socket == INVALID_SOCKET) return INVALID_SOCKET;
  sockaddr_in address{};
  address.sin_family = AF_INET;
  address.sin_port = htons(kBridgePort);
  inet_pton(AF_INET, "127.0.0.1", &address.sin_addr);
  if (connect(socket, reinterpret_cast<sockaddr *>(&address), sizeof(address)) == SOCKET_ERROR) {
    closesocket(socket);
    return INVALID_SOCKET;
  }
  BOOL noDelay = TRUE;
  setsockopt(socket, IPPROTO_TCP, TCP_NODELAY, reinterpret_cast<const char *>(&noDelay), sizeof(noDelay));
  return socket;
}

void senderLoop(TonicPlugin *plugin) {
  std::vector<float> block(static_cast<size_t>(kSendFrames) * kChannels);
  SOCKET socket = INVALID_SOCKET;
  while (plugin->running.load(std::memory_order_acquire)) {
    if (socket == INVALID_SOCKET) {
      socket = connectBridge();
      if (socket == INVALID_SOCKET) {
        std::this_thread::sleep_for(std::chrono::seconds(2));
        continue;
      }
      const int rate = static_cast<int>(plugin->sampleRate.load(std::memory_order_relaxed));
      const std::string handshake = "TONIC1 " + std::to_string(rate) + " " + std::to_string(kChannels) + "\n";
      if (!sendAll(socket, handshake.data(), handshake.size())) {
        closesocket(socket);
        socket = INVALID_SOCKET;
        continue;
      }
      plugin->reconnect.store(false, std::memory_order_release);
    }

    if (plugin->reconnect.exchange(false, std::memory_order_acq_rel)) {
      closesocket(socket);
      socket = INVALID_SOCKET;
      continue;
    }

    const uint32_t frames = plugin->ring.pop(block.data(), kSendFrames);
    if (frames == 0) {
      std::this_thread::sleep_for(std::chrono::milliseconds(4));
      continue;
    }
    uint32_t header[2] = {kMagic, frames};
    if (!sendAll(socket, header, sizeof(header)) ||
        !sendAll(socket, block.data(), static_cast<size_t>(frames) * kChannels * sizeof(float))) {
      closesocket(socket);
      socket = INVALID_SOCKET;
    }
  }
  if (socket != INVALID_SOCKET) closesocket(socket);
}

// ---- CLAP plugin ----

bool pluginInit(const clap_plugin_t *plugin) {
  (void)plugin;
  WSADATA data{};
  return WSAStartup(MAKEWORD(2, 2), &data) == 0;
}

void pluginDestroy(const clap_plugin_t *plugin) {
  auto *self = static_cast<TonicPlugin *>(plugin->plugin_data);
  delete self;
  WSACleanup();
}

bool pluginActivate(const clap_plugin_t *plugin, double sampleRate, uint32_t, uint32_t) {
  auto *self = static_cast<TonicPlugin *>(plugin->plugin_data);
  self->sampleRate.store(sampleRate, std::memory_order_relaxed);
  self->ring.clear();
  self->running.store(true, std::memory_order_release);
  self->sender = std::thread(senderLoop, self);
  return true;
}

void pluginDeactivate(const clap_plugin_t *plugin) {
  auto *self = static_cast<TonicPlugin *>(plugin->plugin_data);
  self->running.store(false, std::memory_order_release);
  if (self->sender.joinable()) self->sender.join();
}

bool pluginStartProcessing(const clap_plugin_t *) { return true; }
void pluginStopProcessing(const clap_plugin_t *) {}

void pluginReset(const clap_plugin_t *plugin) {
  auto *self = static_cast<TonicPlugin *>(plugin->plugin_data);
  self->ring.clear();
  self->reconnect.store(true, std::memory_order_release);
}

clap_process_status pluginProcess(const clap_plugin_t *plugin, const clap_process_t *process) {
  auto *self = static_cast<TonicPlugin *>(plugin->plugin_data);
  if (!process || process->frames_count == 0) return CLAP_PROCESS_CONTINUE;
  if (process->audio_inputs_count == 0 || process->audio_outputs_count == 0) {
    return CLAP_PROCESS_CONTINUE;
  }
  const clap_audio_buffer_t &input = process->audio_inputs[0];
  clap_audio_buffer_t &output = process->audio_outputs[0];
  const uint32_t channels = std::min<uint32_t>(input.channel_count, output.channel_count);
  for (uint32_t channel = 0; channel < channels; ++channel) {
    if (input.data32 && output.data32 && input.data32[channel] && output.data32[channel] &&
        input.data32[channel] != output.data32[channel]) {
      std::memcpy(output.data32[channel], input.data32[channel],
                  static_cast<size_t>(process->frames_count) * sizeof(float));
    } else if (input.data64 && output.data64 && input.data64[channel] && output.data64[channel] &&
               input.data64[channel] != output.data64[channel]) {
      std::memcpy(output.data64[channel], input.data64[channel],
                  static_cast<size_t>(process->frames_count) * sizeof(double));
    }
  }
  self->ring.push(input, process->frames_count);
  return CLAP_PROCESS_CONTINUE;
}

const void *pluginGetExtension(const clap_plugin_t *, const char *id);

uint32_t audioPortsCount(const clap_plugin_t *, bool) { return 1; }

bool audioPortsGet(const clap_plugin_t *, uint32_t index, bool isInput, clap_audio_port_info_t *info) {
  if (index != 0 || !info) return false;
  std::memset(info, 0, sizeof(*info));
  info->id = 0;
  std::strncpy(info->name, isInput ? "Mixer Input" : "Mixer Output", sizeof(info->name) - 1);
  info->flags = CLAP_AUDIO_PORT_IS_MAIN;
  info->channel_count = kChannels;
  info->port_type = CLAP_PORT_STEREO;
  info->in_place_pair = 0;
  return true;
}

const clap_plugin_audio_ports_t audioPorts = {audioPortsCount, audioPortsGet};

const char *const features[] = {
    CLAP_PLUGIN_FEATURE_AUDIO_EFFECT,
    CLAP_PLUGIN_FEATURE_ANALYZER,
    CLAP_PLUGIN_FEATURE_STEREO,
    nullptr,
};

const clap_plugin_descriptor_t descriptor = {
    CLAP_VERSION_INIT,
    "com.tonic.analyzer",
    "TONIC Analyzer",
    "TONIC",
    "https://github.com/Gorilla-Kevv/music-theory",
    "",
    "",
    "0.1.0",
    "Pass-through FL mixer tap that streams audio to the TONIC panel.",
    features,
};

const void *pluginGetExtension(const clap_plugin_t *plugin, const char *id) {
  if (std::strcmp(id, CLAP_EXT_AUDIO_PORTS) == 0) return &audioPorts;
  (void)plugin;
  return nullptr;
}

const clap_plugin_t *createPlugin(const clap_plugin_factory_t *, const clap_host_t *host, const char *pluginId) {
  if (!pluginId || std::strcmp(pluginId, descriptor.id) != 0) return nullptr;
  auto *self = new TonicPlugin();
  self->host = host;
  self->plugin.desc = &descriptor;
  self->plugin.plugin_data = self;
  self->plugin.init = pluginInit;
  self->plugin.destroy = pluginDestroy;
  self->plugin.activate = pluginActivate;
  self->plugin.deactivate = pluginDeactivate;
  self->plugin.start_processing = pluginStartProcessing;
  self->plugin.stop_processing = pluginStopProcessing;
  self->plugin.reset = pluginReset;
  self->plugin.process = pluginProcess;
  self->plugin.get_extension = pluginGetExtension;
  self->plugin.on_main_thread = nullptr;
  return &self->plugin;
}

uint32_t factoryCount(const clap_plugin_factory_t *) { return 1; }
const clap_plugin_descriptor_t *factoryDescriptor(const clap_plugin_factory_t *, uint32_t index) {
  return index == 0 ? &descriptor : nullptr;
}

const clap_plugin_factory_t factory = {factoryCount, factoryDescriptor, createPlugin};

bool entryInit(const char *) { return true; }
void entryDeinit() {}
const void *entryFactory(const char *id) {
  return std::strcmp(id, CLAP_PLUGIN_FACTORY_ID) == 0 ? &factory : nullptr;
}

} // namespace

extern "C" CLAP_EXPORT const clap_plugin_entry_t clap_entry = {
    CLAP_VERSION_INIT,
    entryInit,
    entryDeinit,
    entryFactory,
};
