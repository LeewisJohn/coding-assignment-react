// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { BroadcastChannel } from 'worker_threads'

import { performance } from 'node:perf_hooks';
import { TextDecoder, TextEncoder } from 'node:util';
import { clearImmediate } from 'node:timers';
import { ReadableStream, TransformStream } from 'node:stream/web';

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  performance: { value: performance }, //<--
  clearImmediate: { value: clearImmediate },
})

const { fetch, Request, Response, Headers, FormData } = require("undici");

Reflect.set(globalThis, "fetch", fetch);
Reflect.set(globalThis, "Blob", Blob);
Reflect.set(globalThis, "Request", Request);
Reflect.set(globalThis, "Response", Response);
Reflect.set(globalThis, "Headers", Headers);
Reflect.set(globalThis, "FormData", FormData);
Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannel);

Object.defineProperty(global, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
