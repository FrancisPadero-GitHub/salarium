import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "@/lib/auth";
import type { SignUpFormValues } from "@/types/auth";

/**
 * TanStack Query mutation for email/password sign-up.
 * On success the user is redirected to the login page so they
 * can confirm their email (if email confirmation is enabled) and log in.
 */
export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: (values: Omit<SignUpFormValues, "confirmPassword">) =>
      signUpWithEmail(values),
    onSuccess: () => {
      router.replace("/auth/login?registered=true");
    },
  });
}
