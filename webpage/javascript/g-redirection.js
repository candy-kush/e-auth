function googleRedirection() {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("secret");
  const refreshToken = params.get("token");
  const sessionId = params.get("key");
  const next =
    params.get("next") || "http://127.0.0.1:5500/webpage/html/main-page.html";

  if (accessToken && sessionId && refreshToken) {
    storeWithTTL("secret", accessToken, 15 * 60);
    storeWithTTL("token", refreshToken, 7 * 24 * 60 * 60);
    storeWithTTL("key", sessionId, 15 * 60);
  }

  window.location.href = next;
}

googleRedirection();