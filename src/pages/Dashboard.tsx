import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import Card from "@/components/ui/Card";
import { usePermissions } from "@/hooks/usePermissions";

const Dashboard: React.FC = () => {
  const { hasPermission } = usePermissions();

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts", "recent"],
    queryFn: async () => {
      const allPosts = await api.getPosts();
      return allPosts.slice(0, 5);
    },
    enabled: hasPermission("VIEW_POSTS"),
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", "recent"],
    queryFn: async () => {
      const allComments = await api.getComments();
      return allComments.slice(0, 5);
    },
    enabled: hasPermission("VIEW_COMMENTS"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your dashboard. Here's an overview of recent activity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasPermission("VIEW_POSTS") && (
          <Card title="Recent Posts">
            {postsLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {posts?.map((post) => (
                  <div
                    key={post.id}
                    className="border-b border-gray-200 pb-3 last:border-b-0"
                  >
                    <Link
                      to={`/posts/${post.id}`}
                      className="block hover:text-primary-600"
                    >
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {post.body}
                      </p>
                    </Link>
                  </div>
                ))}
                <div className="pt-3">
                  <Link
                    to="/posts"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View all posts →
                  </Link>
                </div>
              </div>
            )}
          </Card>
        )}

        {hasPermission("VIEW_COMMENTS") && (
          <Card title="Recent Comments">
            {commentsLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {comments?.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-200 pb-3 last:border-b-0"
                  >
                    <h4 className="font-medium text-gray-900 text-sm">
                      {comment.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {comment.email}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {comment.body}
                    </p>
                  </div>
                ))}
                <div className="pt-3">
                  <Link
                    to={`/posts/${comments?.[0]?.postId}/comments`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View all comments →
                  </Link>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {!hasPermission("VIEW_POSTS") && !hasPermission("VIEW_COMMENTS") && (
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900">No Access</h3>
            <p className="text-gray-600 mt-2">
              You don't have permission to view posts or comments.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
