function storeWithTTL(key, value, ttlInSeconds) {
  const data = {
    value,
    expiry: Date.now() + ttlInSeconds * 1000,
  };
  localStorage.setItem(key, JSON.stringify(data));
}

function getWithTTL(key) {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const jsonItem = JSON.parse(item);
  if (Date.now() > jsonItem.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return jsonItem;
}