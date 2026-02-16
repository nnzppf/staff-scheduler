/**
 * Authorized emails that can access the app.
 * Only these Google accounts can view and manage schedules.
 */
export const AUTHORIZED_EMAILS: string[] = [
  "filippo.zanon@gmail.com", // Admin - Owner (change to your actual email)
  "linopegoraro.dir@gmail.com", // Manager - Friend
];

/**
 * Check if an email is authorized to access the app
 */
export function isEmailAuthorized(email: string | null | undefined): boolean {
  if (!email) return false;
  return AUTHORIZED_EMAILS.some(
    (authorized) => authorized.toLowerCase() === email.toLowerCase()
  );
}
