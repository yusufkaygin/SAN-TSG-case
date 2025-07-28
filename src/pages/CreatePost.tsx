import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const createMutation = useMutation({
    mutationFn: (data: { title: string; body: string; userId: number }) =>
      api.createPost(data),
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/posts/${newPost.id}`);
    },
  });

  const validateForm = () => {
    const newErrors: { title?: string; body?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!body.trim()) {
      newErrors.body = "Content is required";
    } else if (body.trim().length < 10) {
      newErrors.body = "Content must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    createMutation.mutate({
      title: title.trim(),
      body: body.trim(),
      userId: 1,
    });
  };

  const handleReset = () => {
    setTitle("");
    setBody("");
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/posts"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          ← Back to Posts
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Create New Post
        </h1>
        <p className="mt-2 text-gray-600">
          Fill out the form below to create a new post.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            placeholder="Enter a compelling title for your post"
            required
          />

          <Textarea
            label="Content"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            error={errors.body}
            placeholder="Write your post content here..."
            rows={10}
            required
          />

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <Link to="/posts">
                <Button variant="secondary">Cancel</Button>
              </Link>

              <Button type="button" variant="secondary" onClick={handleReset}>
                Reset
              </Button>
            </div>

            <Button type="submit" loading={createMutation.isPending}>
              Create Post
            </Button>
          </div>
        </form>

        {createMutation.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              Failed to create post. Please try again.
            </p>
          </div>
        )}
      </Card>

      {/* Preview Card */}
      {(title.trim() || body.trim()) && (
        <Card title="Preview">
          <div className="space-y-4">
            {title.trim() && (
              <h3 className="text-xl font-semibold text-gray-900">
                {title.trim()}
              </h3>
            )}
            {body.trim() && (
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {body.trim()}
              </div>
            )}
            {!title.trim() && !body.trim() && (
              <p className="text-gray-500 italic">
                Start typing to see a preview of your post...
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CreatePost;
