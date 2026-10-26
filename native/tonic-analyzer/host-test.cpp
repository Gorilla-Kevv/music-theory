// Minimal CLAP host for validating the TONIC Analyzer plugin without opening FL.
#define WIN32_LEAN_AND_MEAN
#include <windows.h>

#include <cmath>
#include <cstdio>
#include <cstring>
#include <thread>
#include <vector>

#include <clap/clap.h>

int main() {
  const char *path = "native/tonic-analyzer/TONIC-Analyzer.clap";
  HMODULE module = LoadLibraryA(path);
  if (!module) {
    std::printf("LoadLibrary failed: %lu\n", GetLastError());
    return 1;
  }
  auto *entry = reinterpret_cast<const clap_plugin_entry_t *>(GetProcAddress(module, "clap_entry"));
  if (!entry) {
    std::printf("clap_entry not found\n");
    return 1;
  }
  if (!entry->init(path)) {
    std::printf("entry init failed\n");
    return 1;
  }
  auto *factory = static_cast<const clap_plugin_factory_t *>(entry->get_factory(CLAP_PLUGIN_FACTORY_ID));
  if (!factory) {
    std::printf("factory missing\n");
    return 1;
  }
  const clap_plugin_descriptor_t *descriptor = factory->get_plugin_descriptor(factory, 0);
  std::printf("plugin: %s / %s\n", descriptor->id, descriptor->name);
  const clap_plugin_t *plugin = factory->create_plugin(factory, nullptr, descriptor->id);
  if (!plugin) {
    std::printf("create failed\n");
    return 1;
  }
  if (!plugin->init(plugin) || !plugin->activate(plugin, 48000.0, 64, 1024)) {
    std::printf("init/activate failed\n");
    return 1;
  }
  plugin->start_processing(plugin);
  constexpr uint32_t frames = 512;
  std::vector<float> left(frames);
  std::vector<float> right(frames);
  std::vector<float> outLeft(frames);
  std::vector<float> outRight(frames);
  float *inputs[2] = {left.data(), right.data()};
  float *outputs[2] = {outLeft.data(), outRight.data()};
  clap_audio_buffer_t input{};
  input.data32 = inputs;
  input.channel_count = 2;
  clap_audio_buffer_t output{};
  output.data32 = outputs;
  output.channel_count = 2;
  clap_process_t process{};
  process.frames_count = frames;
  process.audio_inputs = &input;
  process.audio_inputs_count = 1;
  process.audio_outputs = &output;
  process.audio_outputs_count = 1;
  for (int block = 0; block < 200; ++block) {
    for (uint32_t frame = 0; frame < frames; ++frame) {
      const double phase = static_cast<double>(block * frames + frame) / 48000.0;
      left[frame] = static_cast<float>(0.1 * std::sin(phase * 2.0 * 3.141592653589793 * 1000.0));
      right[frame] = left[frame];
    }
    const clap_process_status status = plugin->process(plugin, &process);
    if (status == CLAP_PROCESS_ERROR) {
      std::printf("process error\n");
      break;
    }
    if (std::memcmp(left.data(), outLeft.data(), frames * sizeof(float)) != 0) {
      std::printf("pass-through mismatch at block %d\n", block);
      break;
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(5));
  }
  plugin->stop_processing(plugin);
  plugin->deactivate(plugin);
  plugin->destroy(plugin);
  entry->deinit();
  FreeLibrary(module);
  std::printf("host test done\n");
  return 0;
}
