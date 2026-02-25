"use client";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const TechniciansErrorToast = () => {
  const hasShown = useRef(false);

  useEffect(() => {
    if (!hasShown.current) {
      toast.error("Failed to load technicians data. Please try again later.", {
        position: "top-right",
        richColors: true,
        duration: 5000,
      });
      hasShown.current = true;
    }
  }, []);

  return null;
};
