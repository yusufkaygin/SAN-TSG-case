import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const postId = parseInt(id || "0");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => api.getPost(postId),
    enabled: !!postId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { title: string; body: string }) =>
      api.updatePost(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/posts/${postId}`);
    },
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  const validateForm = () => {
    const newErrors: { title?: string; body?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!body.trim()) {
      newErrors.body = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    updateMutation.mutate({
      title: title.trim(),
      body: body.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
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
            The post you're trying to edit doesn't exist.
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
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Post</h1>
        <p className="mt-2 text-gray-600">Make changes to your post below.</p>
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

          <div className="py-2 px-1 border-b-2 border-primary-500 text-primary-600 font-medium text-sm">
            Edit Post
          </div>

          <Link
            to={`/posts/${post.id}/comments`}
            className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
          >
            Comments
          </Link>
        </nav>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            placeholder="Enter post title"
          />

          <Textarea
            label="Content"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            error={errors.body}
            placeholder="Enter post content"
            rows={8}
          />

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Link to={`/posts/${post.id}`}>
              <Button variant="secondary">Cancel</Button>
            </Link>

            <Button type="submit" loading={updateMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditPost;
