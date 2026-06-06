const tokens = new Map<string, { userId: string; isAdmin: boolean; expires: Date }>();

export function storeAdminToken(token: string, userId: string, expiresAt: Date): void {
  tokens.set(token, { userId, isAdmin: true, expires: expiresAt });
}

export function validateAdminToken(token: string): { userId: string; isAdmin: boolean } | null {
  const entry = tokens.get(token);
  if (!entry) return null;
  if (entry.expires < new Date()) {
    tokens.delete(token);
    return null;
  }
  return { userId: entry.userId, isAdmin: entry.isAdmin };
}

export function revokeAdminToken(token: string): void {
  tokens.delete(token);
}
