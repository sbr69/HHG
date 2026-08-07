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
let systemReduced = false;
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
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  const stored = window.localStorage.getItem(KEY);
  if (stored === "on" || stored === "off" || stored === "auto") setting = stored;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  systemReduced = mq.matches;
  mq.addEventListener("change", (e) => {
    systemReduced = e.matches;
    apply();
    emit();
  });
  apply();
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

/** Returns the stored setting plus the resolved "should we animate" boolean. */
export function useMotion() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "auto" as MotionSetting);
  const reducedSystem = useSyncExternalStore(
    subscribe,
    () => systemReduced,
    () => false,
  );
  const animate = value === "on" || (value === "auto" && !reducedSystem);
  return { setting: value, animate, systemReduced: reducedSystem, setMotionSetting };
}
