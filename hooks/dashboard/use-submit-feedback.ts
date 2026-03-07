import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface UseSubmitFeedbackProps {
  onSuccess?: () => void;
}

export function useSubmitFeedback({ onSuccess }: UseSubmitFeedbackProps = {}) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { user, company_id } = useAuth();

  const submitFeedback = async (formData: FormData) => {
    setLoading(true);

    try {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const type = formData.get("type") as string;
      const file = formData.get("screenshot") as File;

      let screenshot_url = null;

      // Handle file upload if a file was selected
      if (file.size > 0) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${company_id}/feedback/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("feedback-screenshots")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error("Failed to upload screenshot. Please try again.");
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("feedback-screenshots")
          .getPublicUrl(filePath);

        screenshot_url = publicUrl;
      }

      // Insert feedback row
      const { error: insertError } = await supabase
        .from("feedback_reports")
        .insert([
          {
            company_id: typeof company_id === "string" ? company_id : null,
            user_id: user?.id || null,
            type,
            title,
            description,
            page_url: pathname,
            screenshot_url,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      toast.success("Feedback submitted", {
        description: "Thank you! We've received your feedback.",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Feedback error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast.error("Error submitting feedback", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    submitFeedback,
    loading,
  };
}
