"use client";

import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { JobFormValues, PaymentMode } from "@/types/log-job";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobFinancialsFieldsProps {
  register: UseFormRegister<JobFormValues>;
  errors: FieldErrors<JobFormValues>;
  watch: UseFormWatch<JobFormValues>;
  setValue: UseFormSetValue<JobFormValues>;
  isSubmitting: boolean;
  isNetNegative: boolean;
}

export function JobFinancialsFields({
  register,
  watch,
  setValue,
  errors,
  isSubmitting,
  isNetNegative,
}: JobFinancialsFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="job-parts-costs">Parts Costs ($)</Label>
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
      {/* Payment & Status */}

      <div className="space-y-2">
        <Label htmlFor="job-payment">Payment Method</Label>
        <Select
          value={watch("payment_mode")}
          onValueChange={(v) =>
            setValue("payment_mode", v as PaymentMode, { shouldDirty: true })
          }
          disabled={isSubmitting}
        >
          <SelectTrigger id="job-payment" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit card">Credit Card</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="zelle">Zelle</SelectItem>
            <SelectItem value="check">Check</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="job-status">Status</Label>
        <Select
          value={watch("status")}
          onValueChange={(v) => setValue("status", v, { shouldDirty: true })}
          disabled={isSubmitting}
        >
          <SelectTrigger id="job-status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
