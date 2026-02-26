"use client";

import { Trash2, Plus } from "lucide-react";
import { UseFormRegister, FieldArrayWithId } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fmt, type JobFormValues, type PartRow } from "../../../types/log-job";

interface NewPartsSectionProps {
  partFields: FieldArrayWithId<JobFormValues, "parts", "id">[];
  watchedParts: PartRow[] | undefined;
  register: UseFormRegister<JobFormValues>;
  appendPart: (value: PartRow) => void;
  removePart: (index: number) => void;
  isSubmitting: boolean;
  partsTotalCost: number;
}

export function NewPartsSection({
  partFields,
  watchedParts,
  register,
  appendPart,
  removePart,
  isSubmitting,
  partsTotalCost,
}: NewPartsSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Parts</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1 text-xs"
          disabled={isSubmitting}
          onClick={() => appendPart({ name: "", quantity: "1", unit_cost: "" })}
        >
          <Plus className="h-3 w-3" />
          Add Part
        </Button>
      </div>

      {partFields.length > 0 && (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_100px_32px] gap-2 border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
            <span className="text-xs font-medium text-zinc-500">Name</span>
            <span className="text-xs font-medium text-zinc-500">Qty</span>
            <span className="text-xs font-medium text-zinc-500">Unit Cost</span>
            <span />
          </div>

          {/* Rows */}
          {partFields.map((field, index) => {
            const qty = parseFloat(watchedParts?.[index]?.quantity || "0");
            const uc = parseFloat(watchedParts?.[index]?.unit_cost || "0");
            const rowTotal = qty * uc;
            return (
              <div
                key={field.id}
                className="grid grid-cols-[1fr_80px_100px_32px] items-center gap-2 border-b border-zinc-100 px-3 py-2 last:border-0 dark:border-zinc-800"
              >
                <Input
                  placeholder="Part name"
                  className="h-7 text-xs"
                  disabled={isSubmitting}
                  {...register(`parts.${index}.name`, { required: true })}
                />
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  className="h-7 text-xs"
                  disabled={isSubmitting}
                  {...register(`parts.${index}.quantity`)}
                />
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="h-7 text-xs"
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
  );
}
