import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/auth-provider";

export type CreateCompanyInput = {
  email: string;
  password: string;
  company_name: string;
};

type CreateCompanyResponse = {
  data?: {
    user?: {
      id?: string;
    };
    [key: string]: unknown;
  };
  user?: {
    id?: string;
  };
  error?: string;
  message?: string;
};

export function useCreateCompany() {
  const { session } = useAuth();

  return useMutation({
    mutationFn: async ({
      company_name,
      email,
      password,
    }: CreateCompanyInput) => {
      const accessToken = session?.access_token;
      if (!accessToken) {
        throw new Error("Admin is not authenticated");
      }
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

      if (!supabaseUrl) {
        throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/create_company`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            email,
            password,
            company_name,
          }),
        },
      );

      const text = await response.text();
      let json: CreateCompanyResponse = {};

      if (text) {
        try {
          json = JSON.parse(text) as CreateCompanyResponse;
        } catch {
          json = {};
        }
      }

      if (!response.ok) {
        throw new Error(
          json?.error ||
            json?.message ||
            `Failed to create company (${response.status})`,
        );
      }

      return {
        ...json.data,
      };
    },
    onSuccess: () => {
      console.log("Company created successfully:");
    },
    onError: (error) => {
      console.error(
        "Error creating company:",
        error instanceof Error ? error.message : error,
      );
    },
  });
}
