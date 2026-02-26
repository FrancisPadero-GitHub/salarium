"use client";

import { useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Briefcase, Plus, Trash2 } from "lucide-react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useFetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";
import type { Database } from "@/database.types";

type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];
type PartInsert = Database["public"]["Tables"]["parts"]["Insert"];
type PaymentMode = Database["public"]["Enums"]["payment_mode_enum"];

interface PartRow {
  name: string;
  quantity: string;
  unit_cost: string;
}

interface JobFormValues {
  job_date: string;
  job_name: string;
  category: string;
  description: string;
  address: string;
  region: string;
  technician_id: string;
  subtotal: string;
  tip_amount: string;
  cash_on_hand: string;
  payment_mode: PaymentMode;
  status: string;
  notes: string;
  parts: PartRow[];
}

const DEFAULT_VALUES: JobFormValues = {
  job_date: new Date().toISOString().slice(0, 10),
  job_name: "",
  category: "",
  description: "",
  address: "",
  region: "",
  technician_id: "",
  subtotal: "",
  tip_amount: "0",
  cash_on_hand: "0",
  payment_mode: "cash",
  status: "done",
  notes: "",
  parts: [],
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

async function insertJob(values: JobFormValues): Promise<string> {
  const subtotal = parseFloat(values.subtotal) || 0;
  const tip_amount = parseFloat(values.tip_amount) || 0;
  const cash_on_hand = parseFloat(values.cash_on_hand) || 0;
  const parts_total_cost = values.parts.reduce(
    (s, p) =>
      s + (parseFloat(p.unit_cost) || 0) * (parseFloat(p.quantity) || 0),
    0,
  );
  const total_amount = subtotal + tip_amount + parts_total_cost;

  const payload: JobInsert = {
    job_date: values.job_date,
    job_name: values.job_name || null,
    category: values.category || null,
    description: values.description || null,
    address: values.address || null,
    region: values.region || null,
    technician_id: values.technician_id || null,
    subtotal,
    tip_amount,
    cash_on_hand,
    parts_total_cost,
    total_amount,
    payment_mode: values.payment_mode,
    status: values.status,
    notes: values.notes || null,
  };

  const { data, error } = await supabase
    .from("jobs")
    .insert([payload])
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

async function insertParts(jobId: string, parts: PartRow[]): Promise<void> {
  if (!parts.length) return;
  const rows: PartInsert[] = parts.map((p) => ({
    job_id: jobId,
    name: p.name,
    quantity: parseFloat(p.quantity) || 0,
    unit_cost: parseFloat(p.unit_cost) || 0,
    amount: (parseFloat(p.quantity) || 0) * (parseFloat(p.unit_cost) || 0),
  }));
  const { error } = await supabase.from("parts").insert(rows);
  if (error) throw new Error(error.message);
}

export function LogJobDialog() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const { data: technicians = [] } = useFetchTechSummary();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<JobFormValues>({ defaultValues: DEFAULT_VALUES });

  const {
    fields: partFields,
    append: appendPart,
    remove: removePart,
  } = useFieldArray({ control, name: "parts" });

  const watchedParts = watch("parts");
  const partsTotalCost = useMemo(
    () =>
      (watchedParts ?? []).reduce(
        (s, p) =>
          s + (parseFloat(p.unit_cost) || 0) * (parseFloat(p.quantity) || 0),
        0,
      ),
    [watchedParts],
  );

  const selectedTechId = watch("technician_id");
  const subtotalVal = parseFloat(watch("subtotal") || "0");
  const tipVal = parseFloat(watch("tip_amount") || "0");
  const gross = subtotalVal + partsTotalCost + tipVal;
  const tech = technicians.find((t) => t.technician_id === selectedTechId);
  const commissionRate = tech?.commission_rate ?? 0;
  const commissionAmount = gross * (commissionRate / 100);
  const net = gross - commissionAmount;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: JobFormValues) => {
      const jobId = await insertJob(values);
      await insertParts(jobId, values.parts);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"], exact: false });
    },
  });

  const onSubmit = async (data: JobFormValues) => {
    await mutateAsync(data);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOpen(false);
      reset(DEFAULT_VALUES);
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
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
                <Label htmlFor="job-date">Date *</Label>
                <Input
                  id="job-date"
                  type="date"
                  {...register("job_date", { required: "Date is required" })}
                />
                {errors.job_date && (
                  <p className="text-xs text-red-500">
                    {errors.job_date.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-tech">Technician</Label>
                <Select
                  value={selectedTechId}
                  onValueChange={(v) => setValue("technician_id", v)}
                >
                  <SelectTrigger id="job-tech">
                    <SelectValue placeholder="Select tech" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((t) => (
                      <SelectItem
                        key={t.technician_id!}
                        value={t.technician_id!}
                      >
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
                  {...register("job_name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-category">Category</Label>
                <Input
                  id="job-category"
                  placeholder="e.g. HVAC, Plumbing"
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
                  {...register("address")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-region">Region</Label>
                <Input
                  id="job-region"
                  placeholder="e.g. South"
                  {...register("region")}
                />
              </div>
            </div>

            {/* Subtotal, Tips, Cash on Hand */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-subtotal">Subtotal ($) *</Label>
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
                <Label htmlFor="job-tips">Tip ($)</Label>
                <Input
                  id="job-tips"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
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
                  {...register("cash_on_hand")}
                />
              </div>
            </div>

            {/* Parts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Parts</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() =>
                    appendPart({ name: "", quantity: "1", unit_cost: "" })
                  }
                >
                  <Plus className="h-3 w-3" />
                  Add Part
                </Button>
              </div>

              {partFields.length > 0 && (
                <div className="rounded-lg border border-zinc-200 dark:border-zinc-700">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_80px_100px_32px] gap-2 border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
                    <span className="text-xs font-medium text-zinc-500">
                      Name
                    </span>
                    <span className="text-xs font-medium text-zinc-500">
                      Qty
                    </span>
                    <span className="text-xs font-medium text-zinc-500">
                      Unit Cost
                    </span>
                    <span />
                  </div>
                  {/* Rows */}
                  {partFields.map((field, index) => {
                    const qty = parseFloat(
                      watchedParts?.[index]?.quantity || "0",
                    );
                    const uc = parseFloat(
                      watchedParts?.[index]?.unit_cost || "0",
                    );
                    const rowTotal = qty * uc;
                    return (
                      <div
                        key={field.id}
                        className="grid grid-cols-[1fr_80px_100px_32px] items-center gap-2 border-b border-zinc-100 px-3 py-2 last:border-0 dark:border-zinc-800"
                      >
                        <Input
                          placeholder="Part name"
                          className="h-7 text-xs"
                          {...register(`parts.${index}.name`, {
                            required: true,
                          })}
                        />
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          placeholder="1"
                          className="h-7 text-xs"
                          {...register(`parts.${index}.quantity`)}
                        />
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="h-7 text-xs"
                            {...register(`parts.${index}.unit_cost`)}
                          />
                          {rowTotal > 0 && (
                            <span className="absolute -bottom-4 left-0 text-[10px] tabular-nums text-zinc-400">
                              = {fmt(rowTotal)}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removePart(index)}
                          className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                  {/* Parts total */}
                  <div className="flex items-center justify-between rounded-b-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
                    <span className="text-xs text-zinc-500">Parts Total</span>
                    <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                      {fmt(partsTotalCost)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Calculated summary */}
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <div className="grid grid-cols-4 gap-2 text-sm">
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
                    Parts Cost
                  </p>
                  <p className="font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                    {fmt(partsTotalCost)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Commission ({commissionRate}%)
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
                  value={watch("payment_mode")}
                  onValueChange={(v) =>
                    setValue("payment_mode", v as PaymentMode)
                  }
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
                {...register("notes")}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  reset(DEFAULT_VALUES);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving…" : "Save Job"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
