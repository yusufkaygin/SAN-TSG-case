export interface User {
  name: string;
  permissions: Permission[];
}

export type Permission =
  | "VIEW_POSTS"
  | "VIEW_COMMENTS"
  | "EDIT_POST"
  | "CREATE_POST";

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface RouteConfig {
  name: string;
  path: string;
  renderer: {
    type: "element" | "lazy";
    component:
      | React.ComponentType<any>
      | (() => Promise<{ default: React.ComponentType<any> }>);
  };
  permissions?: Permission[];
  translations?: string[];
}

export interface NavigationParams {
  [key: string]: string | number;
}

export interface Navigator {
  [routeName: string]: {
    get: (params?: NavigationParams) => string;
    go: (params?: NavigationParams) => void;
  };
}
