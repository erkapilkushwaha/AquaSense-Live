const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withUsbSerial(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    if (!manifest["uses-feature"]) manifest["uses-feature"] = [];
    const features = manifest["uses-feature"];

    const hasUsbHost = features.some(
      (f) => f.$?.["android:name"] === "android.hardware.usb.host"
    );
    if (!hasUsbHost) {
      features.push({
        $: {
          "android:name": "android.hardware.usb.host",
          "android:required": "false",
        },
      });
    }

    if (!manifest["uses-permission"]) manifest["uses-permission"] = [];
    const perms = manifest["uses-permission"];
    const hasUsb = perms.some(
      (p) => p.$?.["android:name"] === "android.permission.MANAGE_USB"
    );
    if (!hasUsb) {
      perms.push({ $: { "android:name": "android.permission.MANAGE_USB" } });
    }

    return config;
  });
};
