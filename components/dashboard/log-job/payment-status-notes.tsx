"use client";

import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobFormValues, PaymentMode } from "./types";

interface PaymentStatusNotesProps {
  register: UseFormRegister<JobFormValues>;
  watch: UseFormWatch<JobFormValues>;
  setValue: UseFormSetValue<JobFormValues>;
  isSubmitting: boolean;
}

export function PaymentStatusNotes({
  register,
  watch,
  setValue,
  isSubmitting,
}: PaymentStatusNotesProps) {
  return (
    <>
      {/* Payment & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="job-payment">Payment Method</Label>
          <Select
            value={watch("payment_mode")}
            onValueChange={(v) => setValue("payment_mode", v as PaymentMode)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="job-payment">
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
            onValueChange={(v) => setValue("status", v)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="job-status">
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

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="job-notes">Notes</Label>
        <Textarea
          id="job-notes"
          placeholder="Service details, observations..."
          rows={3}
          disabled={isSubmitting}
          {...register("notes")}
        />
      </div>
    </>
  );
}
