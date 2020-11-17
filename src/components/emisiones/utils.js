export const someRole = (personRoles) => (role) =>
  personRoles.some((r) => String(r) === String(role));
