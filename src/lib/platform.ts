export function isNativePlatform(): boolean {
  return typeof window !== "undefined" && "Capacitor" in window;
}

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent);
}
