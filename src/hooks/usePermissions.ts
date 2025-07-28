import type { Permission } from "@/types";
import { useAuth } from "./useAuth";
import { checkPermission, checkPermissions } from "@/utils/permissions";

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    return checkPermission(user, permission);
  };

  const hasPermissions = (permissions: Permission[]): boolean => {
    return checkPermissions(user, permissions);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.some((permission) =>
      user.permissions.includes(permission)
    );
  };

  return {
    hasPermission,
    hasPermissions,
    hasAnyPermission,
  };
};
