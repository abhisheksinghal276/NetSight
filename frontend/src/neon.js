import { neon } from "@neondatabase/neon-js"

export const neonClient = neon({
  auth: {
    baseURL: import.meta.env.VITE_NEON_AUTH_URL,
    apiKey: import.meta.env.VITE_NEON_API_KEY,
  }
})