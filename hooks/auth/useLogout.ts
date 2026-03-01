import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { AUTH_QUERY_KEY } from "@/hooks/auth/useLogin";

/**
 * TanStack Query mutation for signing out.
 * Clears the entire query cache so stale user-specific data
 * is never shown to following sessions.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      queryClient.clear();
      router.replace("/auth/login");
    },
  });
}
