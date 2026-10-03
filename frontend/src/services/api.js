const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://shopinsta.onrender.com/api";
const normalizedApiBase = API_BASE_URL.replace(/\/+$/, "");
const API_URL = normalizedApiBase.endsWith("/api")
  ? normalizedApiBase
  : `${normalizedApiBase}/api`;

export async function api(path, options = {}) {
  const isFormData =
    options.body instanceof FormData;

  const isJsonBody =
    options.body &&
    typeof options.body !== "string" &&
    !isFormData;

  const config = {
    ...options,

    headers: {
      ...(isJsonBody
        ? {
            "Content-Type": "application/json",
          }
        : {}),
      ...(options.headers || {}),
    },

    // Send HTTP-only authentication cookies
    credentials: "include",
  };

  // Convert JavaScript objects to JSON
  if (isJsonBody) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(
    `${API_URL}${path}`,
    config
  );

  // Some endpoints may return an empty response
  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Request failed (${response.status})`
    );
  }

  return data;
}

