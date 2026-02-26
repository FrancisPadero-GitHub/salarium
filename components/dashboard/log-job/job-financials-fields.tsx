"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { JobFormValues } from "../../../types/log-job";

interface JobFinancialsFieldsProps {
  register: UseFormRegister<JobFormValues>;
  errors: FieldErrors<JobFormValues>;
  isSubmitting: boolean;
  isNetNegative: boolean;
}

export function JobFinancialsFields({
  register,
  errors,
  isSubmitting,
  isNetNegative,
}: JobFinancialsFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="job-parts-costs">Parts Costs ($) *</Label>
        <Input
          id="job-parts-costs"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          disabled={isSubmitting}
          className={
            isNetNegative ? "border-red-300 focus-visible:ring-red-500" : ""
          }
          {...register("parts_total_cost", {
            required: "Required",
            min: { value: 0, message: "Must be ≥ 0" },
          })}
        />
        {errors.parts_total_cost && (
          <p className="text-xs text-red-500">
            {errors.parts_total_cost.message}
          </p>
        )}
        {!errors.parts_total_cost && isNetNegative && (
          <p className="text-xs text-red-600 dark:text-red-400">
            Cannot be zero
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-subtotal">Subtotal ($) *</Label>
        <Input
          id="job-subtotal"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          disabled={isSubmitting}
          className={
            isNetNegative ? "border-red-300 focus-visible:ring-red-500" : ""
          }
          {...register("subtotal", {
            required: "Required",
            min: { value: 0, message: "Must be ≥ 0" },
          })}
        />
        {errors.subtotal && (
          <p className="text-xs text-red-500">{errors.subtotal.message}</p>
        )}
        {!errors.subtotal && isNetNegative && (
          <p className="text-xs text-red-600 dark:text-red-400">
            Cannot be zero
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="job-tips">Tip ($)</Label>
        <Input
          id="job-tips"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          disabled={isSubmitting}
          {...register("tip_amount")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="job-cash">Cash on Hand ($)</Label>
        <Input
          id="job-cash"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          disabled={isSubmitting}
          {...register("cash_on_hand")}
        />
      </div>
    </div>
  );
}
