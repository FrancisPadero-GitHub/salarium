import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginWithEmail } from "@/lib/auth";
import type { LoginFormValues } from "@/types/auth";

export const AUTH_QUERY_KEY = ["auth", "user"] as const;

/**
 * TanStack Query mutation for email/password login.
 * On success the auth-user query cache is invalidated so all
 * consumers (AuthProvider, ProtectedRoute, etc.) pick up the new session.
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: LoginFormValues) => loginWithEmail(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      router.replace("/dashboard");
    },
  });
}
