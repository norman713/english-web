// src/utils/parseJwt.ts

/**
 * Giải mã payload của JWT (base64URL → JSON)
 * Trả về một object kiểu Record<string, unknown> hoặc null nếu không parse được
 */
export function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const padded = base64Url.padEnd(base64Url.length + (4 - (base64Url.length % 4)) % 4, "=");
    const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) =>
          "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );
    return JSON.parse(jsonPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
}
