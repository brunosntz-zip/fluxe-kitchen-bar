import { useEffect, useRef } from "react";

/**
 * Listens for ultra-fast keystrokes typical of USB/Bluetooth QR/barcode scanners.
 * - Builds up a buffer of keys
 * - Resets the buffer if more than 50ms passes between keystrokes (ignores human typing)
 * - On Enter, if buffer is longer than 5 chars, fires onScan and clears the buffer
 */
export function useScanner(onScan: (code: string) => void, enabled = true) {
  const bufferRef = useRef("");
  const lastTimeRef = useRef(0);
  const callbackRef = useRef(onScan);

  useEffect(() => {
    callbackRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;

      if (delta > 50) {
        bufferRef.current = "";
      }
      lastTimeRef.current = now;

      if (e.key === "Enter") {
        if (bufferRef.current.length > 5) {
          callbackRef.current(bufferRef.current);
        }
        bufferRef.current = "";
        return;
      }

      if (e.key.length === 1) {
        bufferRef.current += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}
