export const userHasAnyRoles = (userRoles, requireRoles) => {
  return userRoles.some((role) => requireRoles.includes(role));
};
