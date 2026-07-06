/**
 * Production-ready API configuration
 */

// Global API URL setup
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gowings.onrender.com";

/**
 * A wrapper around fetch that provides global error handling if the backend is unavailable.
 * You can replace existing fetch calls with this utility in the future.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    
    // Check for common error codes (e.g., 502 Bad Gateway) when Render backend is down/starting
    if (!res.ok) {
      if (res.status === 502 || res.status === 503) {
        console.warn(`Backend is currently unavailable. Status: ${res.status}`);
      }
    }
    
    return res;
  } catch (error) {
    console.error("Network error: Backend is unreachable.", error);
    
    // Throw a user-friendly error string so the caller can display an alert or toast
    throw new Error("Unable to connect to the backend. Please ensure your connection is active or try again later.");
  }
}
