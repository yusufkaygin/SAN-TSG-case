import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import type { User } from "@/types";

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = () => {
    const user: User = {
      name: "John Doe",
      permissions: ["VIEW_POSTS", "VIEW_COMMENTS"],
    };

    login(user);

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Click the button below to login as a dummy user
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="text-center">
            <Button onClick={handleLogin} size="lg" className="w-full">
              Login as John Doe
            </Button>

            <div className="mt-6 text-sm text-gray-500">
              <p className="font-medium">Dummy User Permissions:</p>
              <ul className="mt-2 space-y-1">
                <li>• VIEW_POSTS</li>
                <li>• VIEW_COMMENTS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
