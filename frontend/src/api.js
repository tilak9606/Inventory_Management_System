const raw = import.meta.env.VITE_API_URL;
const baseURL = raw
  ? `${raw.replace(/\/$/, "")}${raw.includes("/api/v1") ? "" : "/api/v1"}`
  : "/api/v1";

async function request(path, { method = "GET", body } = {}) {
  const resp = await fetch(`${baseURL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = resp.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await resp.json() : await resp.text();

  if (!resp.ok) {
    const err = new Error(
      (isJson && data && (data.error || data.message)) || resp.statusText
    );
    err.response = { status: resp.status, data };
    throw err;
  }

  return { data, status: resp.status };
}

const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export default api;
