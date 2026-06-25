import { Response } from "express";
import { config } from "../config";

const cookieName = "token";

function getCookieOptions() {
  const isProduction = config.nodeEnv === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

export function setAuthCookie(response: Response, token: string) {
  response.cookie(cookieName, token, getCookieOptions());
}

export function clearAuthCookie(response: Response) {
  response.clearCookie(cookieName, getCookieOptions());
}

export { cookieName };
