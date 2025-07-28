import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { usePermissions } from "@/hooks/usePermissions";

const Posts: React.FC = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: api.getPosts,
  });

  const deleteMutation = useMutation({
    mutationFn: api.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <p className="mt-2 text-gray-600">Manage and view all posts</p>
        </div>
        {hasPermission("CREATE_POST") && (
          <Link to="/posts/create">
            <Button>Create New Post</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6">
        {posts?.map((post) => (
          <Card key={post.id}>
            <div className="space-y-4">
              <div>
                <Link
                  to={`/posts/${post.id}`}
                  className="block hover:text-primary-600"
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mt-2">{post.body}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <Link to={`/posts/${post.id}`}>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </Link>

                  {hasPermission("EDIT_POST") && (
                    <Link to={`/posts/${post.id}/edit`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                  )}

                  {hasPermission("VIEW_COMMENTS") && (
                    <Link to={`/posts/${post.id}/comments`}>
                      <Button variant="secondary" size="sm">
                        Comments
                      </Button>
                    </Link>
                  )}
                </div>

                {hasPermission("EDIT_POST") && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    loading={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {posts?.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900">
              No posts found
            </h3>
            <p className="text-gray-600 mt-2">
              There are no posts available at the moment.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Posts;
