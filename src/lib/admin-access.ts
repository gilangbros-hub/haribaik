export function adminAccess(userId: string | undefined, adminUserId: string | undefined) {
  if (!adminUserId) return 'unconfigured';
  if (!userId) return 'unauthenticated';
  return userId === adminUserId ? 'allowed' : 'forbidden';
}
