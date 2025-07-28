import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mt-4">
          Page Not Found
        </p>
        <p className="text-gray-500 mt-2 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-x-4">
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
          <Link to="/posts">
            <Button variant="secondary">View Posts</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
