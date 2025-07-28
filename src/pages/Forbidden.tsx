import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

const Forbidden: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">403</h1>
        <p className="text-xl text-gray-600 mt-4">Access Forbidden</p>
        <p className="text-gray-500 mt-2">
          You don't have permission to access this page.
        </p>

        <div className="mt-8 space-x-4">
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

export default Forbidden;
