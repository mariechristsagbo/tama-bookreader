const MOBILE_QUERY = "(max-width: 809px)";

export function subscribeToMobileQuery(callback: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", callback);

  return () => query.removeEventListener("change", callback);
}

export function getMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

export function getServerMobileSnapshot() {
  return false;
}
