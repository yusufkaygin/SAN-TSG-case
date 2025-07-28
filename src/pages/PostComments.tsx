import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const PostComments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || "0");

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => api.getPost(postId),
    enabled: !!postId,
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: () => api.getPostComments(postId),
    enabled: !!postId,
  });

  if (postLoading || commentsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
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

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/posts/${post.id}`}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          ← Back to Post
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Comments for "{post.title}"
        </h1>
        <p className="mt-2 text-gray-600">
          {comments?.length || 0} comments found
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <Link
            to={`/posts/${post.id}`}
            className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
          >
            View Post
          </Link>

          <Link
            to={`/posts/${post.id}/edit`}
            className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
          >
            Edit Post
          </Link>

          <div className="py-2 px-1 border-b-2 border-primary-500 text-primary-600 font-medium text-sm">
            Comments
          </div>
        </nav>
      </div>

      {comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {comment.name}
                    </h3>
                    <p className="text-sm text-gray-600">{comment.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    Comment #{comment.id}
                  </span>
                </div>

                <div className="text-gray-700 leading-relaxed">
                  {comment.body}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900">
              No comments yet
            </h3>
            <p className="text-gray-600 mt-2">
              This post doesn't have any comments yet.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PostComments;
