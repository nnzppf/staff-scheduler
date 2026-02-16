/**
 * Authorized emails that can access the app.
 * Only these Google accounts can view and manage schedules.
 */
export const AUTHORIZED_EMAILS: string[] = [
  "filzantrade@gmail.com", // Admin - Owner
  "linopegoraro.dir@gmail.com", // Manager
  "raffaele.rinaldi120103@gmail.com", // Manager
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
