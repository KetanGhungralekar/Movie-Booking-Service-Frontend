// Lightweight auth utilities: manage token in cookie + localStorage

const TOKEN_KEY = 'Authorization'

export function getToken() {
  // Prefer cookie (if set), else localStorage
  const cookieMatch = typeof document !== 'undefined'
    ? document.cookie.split('; ').find((row) => row.startsWith(`${TOKEN_KEY}=`))
    : null
  const cookieToken = cookieMatch ? decodeURIComponent(cookieMatch.split('=')[1]) : null
  return cookieToken || (typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null)
}

export function setToken(value) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(TOKEN_KEY, value)
    if (typeof document !== 'undefined') {
      // Non-HttpOnly cookie (front-end only). Backend-managed HttpOnly would be ideal.
      // Lax protects against most CSRF for top-level navigations.
      document.cookie = `${TOKEN_KEY}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
    }
  } catch {}
}

export function clearToken() {
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(TOKEN_KEY)
    if (typeof document !== 'undefined') {
      document.cookie = `${TOKEN_KEY}=; Max-Age=0; path=/; SameSite=Lax`;
    }
  } catch {}
}
