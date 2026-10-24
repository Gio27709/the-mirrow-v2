export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request(
  method: Method,
  endpoint: string,
  token?: string | null,
  body?: unknown,
) {
  const headers: HeadersInit = {};
  // Only send Content-Type when there is a JSON body: on GET it forces a CORS preflight
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handleResponse(res);
}

export const api = {
  get: (endpoint: string, token?: string | null) =>
    request("GET", endpoint, token),

  post: (endpoint: string, body: unknown, token?: string | null) =>
    request("POST", endpoint, token, body),

  put: (endpoint: string, body: unknown, token?: string | null) =>
    request("PUT", endpoint, token, body),

  patch: (endpoint: string, body?: unknown, token?: string | null) =>
    request("PATCH", endpoint, token, body),

  delete: (endpoint: string, token?: string | null) =>
    request("DELETE", endpoint, token),

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

/** Error thrown for non-2xx responses; keeps the HTTP status for callers. */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Backend messages (English) shown to users in Spanish
const ERROR_MESSAGES: Record<string, string> = {
  "Incorrect email or password": "Correo o contraseña incorrectos",
  "Incorrect current password": "La contraseña actual no es correcta",
  "Email already registered": "Este correo ya está registrado",
  "Email already used": "Este correo ya está en uso",
  "Username already taken": "Ese nombre de usuario ya está en uso",
  "User not found": "Usuario no encontrado",
  "User not found with that email": "No hay ningún usuario con ese correo",
  "Not authorized": "No tienes permisos para esta acción",
  "Invalid token": "Tu sesión expiró. Vuelve a iniciar sesión",
  "Could not validate credentials": "Tu sesión expiró. Vuelve a iniciar sesión",
  "Not authenticated": "Debes iniciar sesión",
  "Cannot edit Owner": "No se puede editar al propietario",
  "Cannot delete Owner": "No se puede eliminar al propietario",
  "Cannot change Owner role": "No se puede cambiar el rol del propietario",
  "Cannot modify Owner role": "No se puede cambiar el rol del propietario",
  "Cannot assign Owner role": "No se puede asignar el rol de propietario",
  "Only the Owner can manage admins": "Solo el propietario puede gestionar administradores",
  "Cannot delete yourself": "No puedes eliminar tu propia cuenta",
  "Invalid role": "Rol no válido",
  "File must be an image": "El archivo debe ser una imagen",
  "Google email not verified": "Tu correo de Google no está verificado",
  "You already have a reservation for this event": "Ya tienes una reserva para este evento",
  "This event does not support free reservations": "Este evento no admite reservas gratuitas",
  "Category slug already exists": "Ya existe una categoría con ese identificador",
};

function toMessage(detail: unknown, status: number): string {
  // FastAPI validation errors (422) come as a list of {loc, msg}
  if (Array.isArray(detail)) {
    const fields = detail
      .map((d) => (Array.isArray(d?.loc) ? d.loc[d.loc.length - 1] : null))
      .filter(Boolean);
    return fields.length
      ? `Revisa estos campos: ${[...new Set(fields)].join(", ")}`
      : "Algunos datos no son válidos";
  }
  if (typeof detail === "string" && detail) {
    return ERROR_MESSAGES[detail] ?? detail;
  }
  if (status === 413) return "El archivo es demasiado grande";
  if (status >= 500) return "El servidor tuvo un problema. Inténtalo de nuevo en unos minutos";
  return "Ocurrió un error. Inténtalo de nuevo";
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(toMessage(errorData.detail, res.status), res.status);
  }
  if (res.status === 204) {
    return null;
  }
  return res.json();
}
