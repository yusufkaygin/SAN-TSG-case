import React, { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "@/config/routes";
import { createNavigator } from "@/utils/navigation";
import { useAuth } from "@/hooks/useAuth";
import { checkPermissions } from "@/utils/permissions";
import Layout from "@/components/Layout";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const FullScreenSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
  </div>
);

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  permissions?: string[];
}> = ({ children, permissions }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (permissions?.length && !checkPermissions(user, permissions as any)) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
};

// TODO ARKA ARKAYA LAZY LOADING RENDER PROBLEMI VAR UNUTMAMAMAMA
const RouteRenderer: React.FC<{ route: (typeof routes)[number] }> = ({
  route,
}) => {
  const Component =
    route.renderer.type === "lazy"
      ? (route.renderer.component as React.LazyExoticComponent<React.FC>)
      : (route.renderer.component as React.FC);

  return route.renderer.type === "lazy" ? (
    <Suspense fallback={<FullScreenSpinner />}>
      <Component />
    </Suspense>
  ) : (
    <Component />
  );
};

const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    const nav = createNavigator(navigate, () => user);
    (window as any).nav = nav;
  }, [navigate, user]);

  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullScreenSpinner />;

  return (
    <Routes location={location} key={location.pathname}>
      {/* Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <RouteRenderer route={routes.find((r) => r.name === "login")!} />
          )
        }
      />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute permissions={["VIEW_POSTS", "VIEW_COMMENTS"]}>
            <Layout>
              <RouteRenderer
                route={routes.find((r) => r.name === "dashboard")!}
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Posts list */}
      <Route
        path="/posts"
        element={
          <ProtectedRoute permissions={["VIEW_POSTS"]}>
            <Layout>
              <RouteRenderer route={routes.find((r) => r.name === "posts")!} />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Create post */}
      <Route
        path="/posts/create"
        element={
          <ProtectedRoute permissions={["CREATE_POST"]}>
            <Layout>
              <RouteRenderer
                route={routes.find((r) => r.name === "createPost")!}
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* View single post */}
      <Route
        path="/posts/:id"
        element={
          <ProtectedRoute permissions={["VIEW_POSTS"]}>
            <Layout>
              <RouteRenderer route={routes.find((r) => r.name === "post")!} />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Edit post */}
      <Route
        path="/posts/:id/edit"
        element={
          <ProtectedRoute permissions={["EDIT_POST"]}>
            <Layout>
              <RouteRenderer
                route={routes.find((r) => r.name === "editPost")!}
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Post comments */}
      <Route
        path="/posts/:id/comments"
        element={
          <ProtectedRoute permissions={["VIEW_COMMENTS"]}>
            <Layout>
              <RouteRenderer
                route={routes.find((r) => r.name === "postComments")!}
              />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Forbidden */}
      <Route
        path="/403"
        element={
          <RouteRenderer route={routes.find((r) => r.name === "forbidden")!} />
        }
      />
      <Route
        path="/404"
        element={
          <RouteRenderer route={routes.find((r) => r.name === "notFound")!} />
        }
      />

      {/* Catchall */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/404" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <NavigationProvider>
        <AppRouter />
      </NavigationProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
