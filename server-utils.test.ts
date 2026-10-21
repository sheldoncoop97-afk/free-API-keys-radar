import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isSafeRegisteredEndpoint,
  isValidAspectRatio,
  isValidOperationName,
  normalizeGeneratedAudio,
  readImageDataUrl,
  readPrompt,
} from './server-utils';

test('readPrompt trims valid prompts and rejects empty or oversized input', () => {
  assert.equal(readPrompt('  make a video  '), 'make a video');
  assert.equal(readPrompt('   '), null);
  assert.equal(readPrompt('too long', 3), null);
  assert.equal(readPrompt(12), null);
});

test('readImageDataUrl accepts supported image data and rejects unsafe or oversized data', () => {
  assert.deepEqual(readImageDataUrl('data:image/png;base64,aGVsbG8='), {
    mimeType: 'image/png',
    imageBytes: 'aGVsbG8=',
  });
  assert.equal(readImageDataUrl('https://example.com/image.png'), null);
  assert.equal(readImageDataUrl('data:image/svg+xml;base64,PHN2Zz4='), null);
  assert.equal(readImageDataUrl('data:image/png;base64,@@@'), null);
});

test('video operation names and aspect ratios are constrained', () => {
  assert.equal(isValidOperationName('operations/video_123-test'), true);
  assert.equal(isValidOperationName('https://example.com/operations/1'), false);
  assert.equal(isValidAspectRatio('9:16'), true);
  assert.equal(isValidAspectRatio('1:1'), false);
});

test('endpoint probes can only target the exact registered HTTPS endpoint', () => {
  const endpoint = 'https://api.example.com/v1/ping';
  assert.equal(isSafeRegisteredEndpoint(endpoint, endpoint), true);
  assert.equal(isSafeRegisteredEndpoint('http://api.example.com/v1/ping', endpoint), false);
  assert.equal(isSafeRegisteredEndpoint('https://localhost/v1/ping', endpoint), false);
  assert.equal(isSafeRegisteredEndpoint('https://api.example.com/v1/other', endpoint), false);
  assert.equal(isSafeRegisteredEndpoint('https://api.example.com/{id}', 'https://api.example.com/{id}'), false);
});

test('raw generated PCM is normalized into a playable WAV file', () => {
  const result = normalizeGeneratedAudio(Buffer.from([0x00, 0x01, 0xff, 0xfe]), 'audio/L16;codec=pcm;rate=24000');
  assert.equal(result.mimeType, 'audio/wav');
  assert.equal(result.audio.toString('ascii', 0, 4), 'RIFF');
  assert.equal(result.audio.readUInt32LE(24), 24000);
  assert.equal(result.audio.readUInt32LE(40), 4);
  assert.deepEqual(result.audio.subarray(44), Buffer.from([0x01, 0x00, 0xfe, 0xff]));
  assert.throws(() => normalizeGeneratedAudio(Buffer.from([0x00]), 'audio/pcm;rate=24000'));
});
