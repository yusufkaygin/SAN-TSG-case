import { routes } from "@/config/routes";
import type { Navigator, NavigationParams, User } from "@/types";
import { checkPermissions } from "./permissions";

const generatePath = (path: string, params: NavigationParams = {}): string => {
  let result = path;

  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });

  return result;
};

export const createNavigator = (
  navigate: (path: string) => void,
  getCurrentUser: () => User | null
): Navigator => {
  const nav: Navigator = {};

  routes.forEach((route) => {
    nav[route.name] = {
      get: (params?: NavigationParams) => {
        return generatePath(route.path, params);
      },
      go: (params?: NavigationParams) => {
        const user = getCurrentUser();

        if (route.permissions && route.permissions.length > 0) {
          if (!checkPermissions(user, route.permissions)) {
            alert("You don't have permission to access this page.");
            return;
          }
        }

        if (route.translations && route.translations.length > 0) {
          Promise.all(route.translations.map(() => Promise.resolve())).then(
            () => {
              navigate(generatePath(route.path, params));
            }
          );
        } else {
          navigate(generatePath(route.path, params));
        }
      },
    };
  });

  return nav;
};
