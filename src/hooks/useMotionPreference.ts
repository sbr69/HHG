import { useSyncExternalStore } from "react";

/**
 * Motion preference store.
 * "auto" follows the OS setting, "on"/"off" are explicit user overrides.
 * The resolved value is mirrored onto <html data-motion="on|off"> so CSS can
 * disable every animation site-wide without prop drilling.
 */
export type MotionSetting = "auto" | "on" | "off";

const KEY = "hhgoa.motion";
const listeners = new Set<() => void>();

let setting: MotionSetting = "auto";
const systemReduced = false;
let initialised = false;

function emit() {
  for (const l of listeners) l();
}

function apply() {
  if (typeof document === "undefined") return;
  const on = setting === "on" || (setting === "auto" && !systemReduced);
  document.documentElement.dataset["motion"] = on ? "on" : "off";
}

function init() {
  if (typeof document !== "undefined") {
    document.documentElement.dataset["motion"] = "on";
  }
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  document.documentElement.dataset["motion"] = "on";
}

function subscribe(cb: () => void) {
  init();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function snapshot() {
  return setting;
}

export function setMotionSetting(next: MotionSetting) {
  setting = next;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, next);
  apply();
  emit();
}

/** Returns the stored setting plus the resolved "should we animate" boolean (defaults to always on). */
export function useMotion() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "on" as MotionSetting);
  return { setting: value, animate: true, systemReduced: false, setMotionSetting };
}
