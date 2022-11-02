import { authStatus } from "../composables/auth";

export const authGuard = (to, from, next) => {
  if (authStatus.isAuthenticated) {
    return next();
  }
  next({
    name: "Login",
    query: { redirect: to.fullPath },
  });
};
