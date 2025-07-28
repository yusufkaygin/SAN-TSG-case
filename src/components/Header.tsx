import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import Button from "@/components/ui/Button";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              SAN TSG
            </Link>

            <nav className="flex space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>

              {hasPermission("VIEW_POSTS") && (
                <Link
                  to="/posts"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Posts
                </Link>
              )}

              {hasPermission("CREATE_POST") && (
                <Link
                  to="/posts/create"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Create Post
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome, {user.name}</span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
