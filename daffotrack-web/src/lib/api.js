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
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      // Handle the specific JSON format: {"timestamp":"...","status":409,"error":"Conflict","path":"..."}
      if (errorData && typeof errorData === 'object') {
        errorMessage = errorData.error || errorData.message || errorMessage;
      }
    } catch {
      // If not JSON, try text
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch {
        // Fallback to default
      }
    }

    // Emit a global event so the ToastProvider can catch it
    window.dispatchEvent(new CustomEvent('daffotrack.apiError', {
      detail: { message: errorMessage }
    }));

    throw new Error(errorMessage);
  }

  return response.json();
}

export function buildApiUrl(path) {
  return `${apiBaseUrl}${path}`;
}