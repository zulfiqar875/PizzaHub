// src/api/client.js
const API_BASE = '/pizzahub-api/public'; // <-- important

export async function api(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const t = await res.text().catch(()=>'');
    throw new Error(t || `HTTP ${res.status}`);
  }
  return res.json();
}
