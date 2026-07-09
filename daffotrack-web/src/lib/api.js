// Railway theke pawa tomar backend URL
export const apiBaseUrl = 'https://daffotrackai-production.up.railway.app';

export async function apiRequest(path, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const { headers: customHeaders, ...restOptions } = options;
  const headers = isFormData
      ? { ...(customHeaders || {}) }
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
      if (errorData && typeof errorData === 'object') {
        errorMessage = errorData.error || errorData.message || errorMessage;
      }
    } catch {
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch {
      //
      }
    }

    window.dispatchEvent(new CustomEvent('daffotrack.apiError', {
      detail: { message: errorMessage }
    }));
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function buildApiUrl(path) {
  return `${apiBaseUrl}${path}`;
}