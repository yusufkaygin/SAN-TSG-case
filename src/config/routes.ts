import React from "react";
import type { RouteConfig } from "@/types";
import { PERMISSIONS } from "@/utils/permissions";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

const Posts = React.lazy(() => import("@/pages/Posts"));
const Post = React.lazy(() => import("@/pages/Post"));
const EditPost = React.lazy(() => import("@/pages/EditPost"));
const PostComments = React.lazy(() => import("@/pages/PostComments"));
const CreatePost = React.lazy(() => import("@/pages/CreatePost"));
const Forbidden = React.lazy(() => import("@/pages/Forbidden"));

export const routes: RouteConfig[] = [
  {
    name: "login",
    path: "/login",
    renderer: { type: "element", component: Login },
  },
  {
    name: "dashboard",
    path: "/",
    renderer: { type: "element", component: Dashboard },
    permissions: [PERMISSIONS.VIEW_POSTS, PERMISSIONS.VIEW_COMMENTS],
    translations: ["dashboard"],
  },
  {
    name: "posts",
    path: "/posts",
    renderer: { type: "lazy", component: Posts },
    permissions: [PERMISSIONS.VIEW_POSTS],
    translations: ["posts"],
  },
  {
    name: "post",
    path: "/posts/:id",
    renderer: { type: "lazy", component: Post },
    permissions: [PERMISSIONS.VIEW_POSTS],
    translations: ["post"],
  },
  {
    name: "editPost",
    path: "/posts/:id/edit",
    renderer: { type: "lazy", component: EditPost },
    permissions: [PERMISSIONS.EDIT_POST],
    translations: ["editPost"],
  },
  {
    name: "postComments",
    path: "/posts/:id/comments",
    renderer: { type: "lazy", component: PostComments },
    permissions: [PERMISSIONS.VIEW_COMMENTS],
    translations: ["postComments"],
  },
  {
    name: "createPost",
    path: "/posts/create",
    renderer: { type: "lazy", component: CreatePost },
    permissions: [PERMISSIONS.CREATE_POST],
    translations: ["createPost"],
  },
  {
    name: "forbidden",
    path: "/403",
    renderer: { type: "lazy", component: Forbidden },
  },
  {
    name: "notFound",
    path: "/404",
    renderer: { type: "element", component: NotFound },
  },
];
