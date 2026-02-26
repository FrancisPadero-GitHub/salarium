"use client";

import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TechnicianSummaryRow } from "@/hooks/technicians/useFetchTechSummary";
import type { JobFormValues } from "./types";

interface JobBasicFieldsProps {
  register: UseFormRegister<JobFormValues>;
  errors: FieldErrors<JobFormValues>;
  isSubmitting: boolean;
  technicians: TechnicianSummaryRow[];
  selectedTechId: string;
  setValue: UseFormSetValue<JobFormValues>;
}

export function JobBasicFields({
  register,
  errors,
  isSubmitting,
  technicians,
  selectedTechId,
  setValue,
}: JobBasicFieldsProps) {
  return (
    <>
      {/* Date & Technician */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="job-date">Date *</Label>
          <Input
            id="job-date"
            type="date"
            disabled={isSubmitting}
            {...register("job_date", { required: "Date is required" })}
          />
          {errors.job_date && (
            <p className="text-xs text-red-500">{errors.job_date.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="job-tech">Technician</Label>
          <Select
            value={selectedTechId}
            onValueChange={(v) => setValue("technician_id", v)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="job-tech">
              <SelectValue placeholder="Select tech" />
            </SelectTrigger>
            <SelectContent>
              {technicians.map((t) => (
                <SelectItem key={t.technician_id!} value={t.technician_id!}>
                  {t.name} ({t.commission_rate}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Job Name & Category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="job-name">Job Name</Label>
          <Input
            id="job-name"
            placeholder="e.g. AC Repair"
            disabled={isSubmitting}
            {...register("job_name")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="job-category">Category</Label>
          <Input
            id="job-category"
            placeholder="e.g. HVAC, Plumbing"
            disabled={isSubmitting}
            {...register("category")}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="job-description">Description</Label>
        <Input
          id="job-description"
          placeholder="Short service description"
          disabled={isSubmitting}
          {...register("description")}
        />
      </div>

      {/* Address & Region */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="job-address">Address</Label>
          <Input
            id="job-address"
            placeholder="123 Main St, Tampa, FL"
            disabled={isSubmitting}
            {...register("address")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="job-region">Region</Label>
          <Input
            id="job-region"
            placeholder="e.g. South"
            disabled={isSubmitting}
            {...register("region")}
          />
        </div>
      </div>
    </>
  );
}
