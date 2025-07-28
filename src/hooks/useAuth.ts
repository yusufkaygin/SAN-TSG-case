import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";

const QUERY_KEY = "currentUser";

const getSavedUser = (): User | null => {
  const saved = localStorage.getItem("currentUser");
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: [QUERY_KEY],
    queryFn: getSavedUser,
    initialData: getSavedUser,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const login = (userData: User) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    queryClient.setQueryData([QUERY_KEY], userData);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    queryClient.setQueryData([QUERY_KEY], null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
};
