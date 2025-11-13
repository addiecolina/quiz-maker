import { useEffect, useRef, useCallback } from "react";

interface CheatingDetectionOptions {
  enabled?: boolean;
}

/**
 * Custom hook to detect potential cheating behaviors:
 * - Tab switching (visibility change)
 * - Paste events
 *
 * Returns true if cheating was detected during the current session
 */
export function useCheatingDetection(
  options: CheatingDetectionOptions = {}
): boolean {
  const { enabled = true } = options;
  const cheatingDetectedRef = useRef(false);

  const handleVisibilityChange = useCallback(() => {
    if (!enabled) return;

    if (document.hidden) {
      console.log("[useCheatingDetection] Tab switched away (hidden)");
      cheatingDetectedRef.current = true;
    } else {
      console.log("[useCheatingDetection] Tab switched back (visible)");
      cheatingDetectedRef.current = true;
    }
  }, [enabled]);

  const handlePaste = useCallback(() => {
    if (!enabled) return;

    console.log("[useCheatingDetection] Paste event detected");
    cheatingDetectedRef.current = true;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("paste", handlePaste);
    };
  }, [enabled, handleVisibilityChange, handlePaste]);

  return cheatingDetectedRef.current;
}
