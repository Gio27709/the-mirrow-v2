const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const api = {
  async get(endpoint: string, token?: string | null) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers,
    });
    return handleResponse(res);
  },

  async post(endpoint: string, body: unknown, token?: string | null) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async put(endpoint: string, body: unknown, token?: string | null) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async delete(endpoint: string, token?: string | null) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    return handleResponse(res);
  },

  // For file uploads assuming FormData
  async upload(
    endpoint: string,
    formData: FormData,
    token?: string | null,
    method: "POST" | "PUT" = "POST",
  ) {
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: formData,
    });
    return handleResponse(res);
  },
};

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "An error occurred");
  }
  if (res.status === 204) {
    return null;
  }
  return res.json();
}
