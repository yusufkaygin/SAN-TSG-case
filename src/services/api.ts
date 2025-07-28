import type { Post, Comment } from "@/types";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const api = {
  getPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${BASE_URL}/posts`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  },

  getPost: async (id: number): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/posts/${id}`);
    if (!response.ok) throw new Error("Failed to fetch post");
    return response.json();
  },

  createPost: async (post: Omit<Post, "id">): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    if (!response.ok) throw new Error("Failed to create post");
    return response.json();
  },

  updatePost: async (id: number, post: Partial<Post>): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    if (!response.ok) throw new Error("Failed to update post");
    return response.json();
  },

  deletePost: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete post");
  },

  getComments: async (): Promise<Comment[]> => {
    const response = await fetch(`${BASE_URL}/comments`);
    if (!response.ok) throw new Error("Failed to fetch comments");
    return response.json();
  },

  getPostComments: async (postId: number): Promise<Comment[]> => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) throw new Error("Failed to fetch post comments");
    return response.json();
  },
};
