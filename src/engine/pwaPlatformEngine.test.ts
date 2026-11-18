import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectClientPlatform,
  LINUX_ANDROID_INSTALL_GUIDES
} from './pwaPlatformEngine';

test('detectClientPlatform identifies Android before Linux even when UA contains Linux', () => {
  const androidUa =
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';
  const info = detectClientPlatform(androidUa, 5);
  assert.equal(info.platform, 'android');
  assert.equal(info.isAndroid, true);
  assert.equal(info.isLinux, false);
  assert.equal(info.isMobile, true);
});

test('detectClientPlatform identifies Linux desktop browsers accurately', () => {
  const linuxUa =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
  const info = detectClientPlatform(linuxUa, 0);
  assert.equal(info.platform, 'linux');
  assert.equal(info.isLinux, true);
  assert.equal(info.isAndroid, false);
  assert.equal(info.isMobile, false);
});

test('detectClientPlatform identifies iOS and iPadOS desktop UA via touchPoints', () => {
  const iphoneUa =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15';
  assert.equal(detectClientPlatform(iphoneUa, 5).platform, 'ios');

  const ipadDesktopUa =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15';
  assert.equal(detectClientPlatform(ipadDesktopUa, 5).platform, 'ios');
  assert.equal(detectClientPlatform(ipadDesktopUa, 0).platform, 'macos');
});

test('LINUX_ANDROID_INSTALL_GUIDES provides complete 3-step instructions for both platforms', () => {
  assert.equal(LINUX_ANDROID_INSTALL_GUIDES.linux.steps.length, 3);
  assert.equal(LINUX_ANDROID_INSTALL_GUIDES.android.steps.length, 3);
});
