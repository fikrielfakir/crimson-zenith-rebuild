import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'journey-association-admin-jwt-2024'
);

export async function generateAdminToken(userId: string, expiresAt: Date): Promise<string> {
  return await new SignJWT({ userId, isAdmin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(JWT_SECRET);
}

export async function validateAdminToken(
  token: string
): Promise<{ userId: string; isAdmin: boolean } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string, isAdmin: true };
  } catch {
    return null;
  }
}

export function revokeAdminToken(_token: string): void {
  // JWT tokens are stateless — they expire automatically.
  // The client clears the token from sessionStorage on logout.
}

// Legacy no-ops kept for import compatibility during migration.
export function storeAdminToken(_token: string, _userId: string, _expiresAt: Date): void {}
