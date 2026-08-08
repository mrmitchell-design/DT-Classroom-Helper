/* ------------------------------------------------------------------ */
/* API HELPER                                                          */
/* ------------------------------------------------------------------ */

async function api(path, options) {
  const res = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let body = null;
  const text = await res.text();
  if (text) {
    try { body = JSON.parse(text); } catch (e) { body = null; }
  }
  if (!res.ok) {
    const message = (body && body.error) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

const apiGet = (path) => api(path);
const apiPost = (path, data) => api(path, { method: "POST", body: JSON.stringify(data || {}) });
const apiPut = (path, data) => api(path, { method: "PUT", body: JSON.stringify(data || {}) });
const apiPatch = (path, data) => api(path, { method: "PATCH", body: JSON.stringify(data || {}) });
const apiDelete = (path) => api(path, { method: "DELETE" });
