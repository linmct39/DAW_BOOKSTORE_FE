export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const ADMIN_EMAILS = ['kiet0123745@gmail.com'];

export function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}
