// Ensure this file runs before any server code in Next.js runtime
// Next.js calls register() early on both edge and node runtimes.
export async function register() {
  try {
    // Minimal ProgressEvent polyfill for Node.js
    if (typeof (globalThis as any).ProgressEvent === "undefined") {
      (globalThis as any).ProgressEvent = class ProgressEvent {
        type: string;
        constructor(type: string, _init?: any) {
          this.type = String(type ?? "progress");
        }
      };
    }
  } catch {
    // no-op
  }
}


