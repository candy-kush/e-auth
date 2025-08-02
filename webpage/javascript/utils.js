function storeWithTTL(key, value, ttlInSeconds) {
  const payload = {
    value,
    expiry: Date.now() + ttlInSeconds * 1000,
  };
  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.error(`Failed to store key "${key}"`, err);
  }
}

function getWithTTL(key) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.value;
  } catch (err) {
    console.error(`Failed to read key "${key}"`, err);
    localStorage.removeItem(key);
    return null;
  }
}

function getRemainingTTL(key) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    const remaining = parsed.expiry - Date.now();
    return remaining > 0 ? remaining : null;
  } catch (err) {
    return null;
  }
}

function showToast(message, duration = 3000, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.classList.remove("hidden", "show", "error");

  if (type === "error") {
    toast.classList.add("error");
  }

  toast.textContent = message;

  void toast.offsetWidth;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, duration);
}

function showGlobalError(message) {
  const errorBox = document.getElementById("errorMessage");
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function hideGlobalError() {
  const errorBox = document.getElementById("errorMessage");
  if (!errorBox) return;
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function removeKey(key) {
  localStorage.removeItem(key);
}
