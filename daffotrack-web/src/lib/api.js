export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export async function apiRequest(path, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const { headers: customHeaders, ...restOptions } = options;
  const headers = isFormData
    ? {
        ...(customHeaders || {}),
      }
    : {
        'Content-Type': 'application/json',
        ...(customHeaders || {}),
      };

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...restOptions,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export function buildApiUrl(path) {
  return `${apiBaseUrl}${path}`;
}