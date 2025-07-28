import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { usePermissions } from "@/hooks/usePermissions";

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { hasPermission } = usePermissions();

  const postId = parseInt(id || "0");

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => api.getPost(postId),
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <Card>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900">Post not found</h3>
          <p className="text-gray-600 mt-2">
            The post you're looking for doesn't exist.
          </p>
          <Link to="/posts" className="mt-4 inline-block">
            <Button>Back to Posts</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const isEditPage = location.pathname.includes("/edit");
  const isCommentsPage = location.pathname.includes("/comments");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/posts"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            ← Back to Posts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {post.title}
          </h1>
        </div>

        <div className="flex space-x-3">
          {hasPermission("EDIT_POST") && (
            <Link to={`/posts/${post.id}/edit`}>
              <Button variant="secondary">Edit Post</Button>
            </Link>
          )}

          {hasPermission("VIEW_COMMENTS") && (
            <Link to={`/posts/${post.id}/comments`}>
              <Button variant="secondary">View Comments</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            to={`/posts/${post.id}`}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              !isEditPage && !isCommentsPage
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            View Post
          </Link>

          {hasPermission("EDIT_POST") && (
            <Link
              to={`/posts/${post.id}/edit`}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                isEditPage
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Edit Post
            </Link>
          )}

          {hasPermission("VIEW_COMMENTS") && (
            <Link
              to={`/posts/${post.id}/comments`}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                isCommentsPage
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Comments
            </Link>
          )}
        </nav>
      </div>

      {/* Post Content */}
      {!isEditPage && !isCommentsPage && (
        <Card>
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {post.title}
            </h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {post.body}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Post ID: {post.id} | User ID: {post.userId}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Post;
