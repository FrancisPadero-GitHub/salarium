"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { technicians } from "@/data/technicians";
import type { PaymentMethod, JobStatus } from "@/types/job";

interface JobFormValues {
  date: string;
  address: string;
  technicianId: string;
  parts: string;
  tips: string;
  subtotal: string;
  paymentMethod: PaymentMethod;
  status: JobStatus;
  notes: string;
}

export function LogJobDialog() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormValues>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      address: "",
      technicianId: "",
      parts: "0",
      tips: "0",
      subtotal: "",
      paymentMethod: "Credit Card",
      status: "Done",
      notes: "",
    },
  });

  const selectedTechId = watch("technicianId");
  const subtotalVal = parseFloat(watch("subtotal") || "0");
  const partsVal = parseFloat(watch("parts") || "0");
  const tipsVal = parseFloat(watch("tips") || "0");
  const gross = subtotalVal + partsVal + tipsVal;
  const tech = technicians.find((t) => t.id === selectedTechId);
  const commissionRate = tech?.commissionRate ?? 0;
  const commissionAmount = gross * commissionRate;
  const net = gross - commissionAmount;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);

  const onSubmit = (data: JobFormValues) => {
    const techData = technicians.find((t) => t.id === data.technicianId);
    const parts = parseFloat(data.parts) || 0;
    const tips = parseFloat(data.tips) || 0;
    const subtotal = parseFloat(data.subtotal) || 0;
    const grossAmount = subtotal + parts + tips;
    const rate = techData?.commissionRate ?? 0;

    const job = {
      id: `job-${Date.now()}`,
      date: data.date,
      address: data.address,
      technicianId: data.technicianId,
      technicianName: techData?.name ?? "",
      parts,
      tips,
      subtotal,
      gross: grossAmount,
      commissionRate: rate,
      commissionAmount: grossAmount * rate,
      net: grossAmount - grossAmount * rate,
      paymentMethod: data.paymentMethod,
      status: data.status,
      notes: data.notes || undefined,
    };

    console.log("New job recorded:", job);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOpen(false);
      reset();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Briefcase className="mr-2 h-4 w-4" />
          Log Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Log New Job</DialogTitle>
          <DialogDescription>
            Record a completed or pending job for a technician.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
              <Briefcase className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Job recorded successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
            {/* Date & Technician */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-date">Date</Label>
                <Input
                  id="job-date"
                  type="date"
                  {...register("date", { required: "Date is required" })}
                />
                {errors.date && (
                  <p className="text-xs text-red-500">{errors.date.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-tech">Technician</Label>
                <Select
                  value={selectedTechId}
                  onValueChange={(v) => setValue("technicianId", v)}
                >
                  <SelectTrigger id="job-tech">
                    <SelectValue placeholder="Select tech" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians
                      .filter((t) => t.active)
                      .map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name} ({Math.round(t.commissionRate * 100)}%)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("technicianId", {
                    required: "Select a technician",
                  })}
                />
                {errors.technicianId && (
                  <p className="text-xs text-red-500">
                    {errors.technicianId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="job-address">Address</Label>
              <Input
                id="job-address"
                placeholder="123 Main St, Tampa, FL"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* Subtotal, Parts, Tips */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-subtotal">Subtotal ($)</Label>
                <Input
                  id="job-subtotal"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("subtotal", {
                    required: "Required",
                    min: { value: 0, message: "Must be ≥ 0" },
                  })}
                />
                {errors.subtotal && (
                  <p className="text-xs text-red-500">
                    {errors.subtotal.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-parts">Parts ($)</Label>
                <Input
                  id="job-parts"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("parts")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-tips">Tips ($)</Label>
                <Input
                  id="job-tips"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("tips")}
                />
              </div>
            </div>

            {/* Calculated fields */}
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Gross
                  </p>
                  <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                    {fmt(gross)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Commission ({Math.round(commissionRate * 100)}%)
                  </p>
                  <p className="font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                    {fmt(commissionAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Net to Business
                  </p>
                  <p className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {fmt(net)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-payment">Payment Method</Label>
                <Select
                  value={watch("paymentMethod")}
                  onValueChange={(v) =>
                    setValue("paymentMethod", v as PaymentMethod)
                  }
                >
                  <SelectTrigger id="job-payment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Zelle">Zelle</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-status">Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(v) => setValue("status", v as JobStatus)}
                >
                  <SelectTrigger id="job-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
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
                {...register("notes")}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Job</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
