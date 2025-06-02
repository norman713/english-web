// src/utils/jwt.ts
export type RawRole = "ADMIN" | "SYSTEM_ADMIN" | "LEARNER" | "GUEST";

/**
 * Giải mã payload của JWT (base64URL → JSON).
 * Nếu parse lỗi, trả về null.
 */
export function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const padded =
      base64Url +
      "===".slice((base64Url.length + 3) % 4);
    const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload) as Record<string, unknown>;
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

/**
 * Lấy role trực tiếp từ JWT. Nếu token không hợp lệ hoặc không có trường role,
 * trả về "GUEST".
 */
export function getRoleFromToken(): RawRole {
  const token = localStorage.getItem("accessToken");
  if (!token) return "GUEST";
  const decoded = parseJwt(token);
  if (!decoded) return "GUEST";

  const r = decoded["role"];
  if (r === "SYSTEM_ADMIN") return "SYSTEM_ADMIN";
  if (r === "ADMIN") return "ADMIN";
  if (r === "LEARNER") return "LEARNER";
  return "GUEST";
}

/**
 * Lấy userId (sub) từ JWT, nếu có.
 */
export function getUserIdFromToken(): string | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  const decoded = parseJwt(token);
  if (!decoded) return null;
  const sub = decoded["sub"];
  if (typeof sub === "string") return sub;
  return null;
}
