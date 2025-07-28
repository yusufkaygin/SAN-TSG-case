import type { Permission, User } from "@/types";

export const checkPermission = (
  user: User | null,
  permission: Permission
): boolean => {
  if (!user) return false;
  return user.permissions.includes(permission);
};

export const checkPermissions = (
  user: User | null,
  permissions: Permission[]
): boolean => {
  if (!user) return false;
  return permissions.every((permission) =>
    user.permissions.includes(permission)
  );
};

export const PERMISSIONS = {
  VIEW_POSTS: "VIEW_POSTS" as const,
  VIEW_COMMENTS: "VIEW_COMMENTS" as const,
  EDIT_POST: "EDIT_POST" as const,
  CREATE_POST: "CREATE_POST" as const,
};
