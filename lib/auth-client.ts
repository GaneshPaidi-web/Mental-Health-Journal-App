const TOKEN_KEY = "authToken"
const USER_KEY = "currentUser"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  dob?: string
  gender?: string
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuth(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem(USER_KEY)
  if (!userData) return null
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const headers = new Headers(options.headers)

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  return fetch(url, { ...options, headers })
}
