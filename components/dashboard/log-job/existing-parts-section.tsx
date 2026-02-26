"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { fmt } from "../../../types/log-job";
import type { Database } from "@/database.types";

type Part = Database["public"]["Tables"]["parts"]["Row"];

interface ExistingPartEditState {
  id: string;
  name: string;
  quantity: string;
  unit_cost: string;
}

interface ExistingPartsSectionProps {
  existingParts: Part[];
  isPartsLoading: boolean;
  partsToDelete: { id: string; name: string }[];
  setPartsToDelete: React.Dispatch<
    React.SetStateAction<{ id: string; name: string }[]>
  >;
  existingPartEditState: Record<string, ExistingPartEditState>;
  setExistingPartEditState: React.Dispatch<
    React.SetStateAction<Record<string, ExistingPartEditState>>
  >;
  isSubmitting: boolean;
}

export function ExistingPartsSection({
  existingParts,
  isPartsLoading,
  partsToDelete,
  setPartsToDelete,
  existingPartEditState,
  setExistingPartEditState,
  isSubmitting,
}: ExistingPartsSectionProps) {
  if (isPartsLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400">
        <Spinner className="h-3 w-3" />
        Loading existing parts...
      </div>
    );
  }

  const visibleParts = existingParts.filter(
    (p) => !partsToDelete.some((d) => d.id === p.id),
  );

  if (visibleParts.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-900/30 dark:bg-amber-900/10">
      <p className="mb-2 text-xs font-medium text-amber-900 dark:text-amber-200">
        Existing Parts
      </p>
      <div className="space-y-2">
        {visibleParts.map((part) => {
          const edited = existingPartEditState[part.id];
          const isEditing = !!edited;
          const displayName = edited ? edited.name : part.name;
          const displayQty = edited ? edited.quantity : String(part.quantity);
          const displayCost = edited
            ? edited.unit_cost
            : String(part.unit_cost);
          const qty = parseFloat(displayQty);
          const cost = parseFloat(displayCost);
          const rowTotal = qty * cost;

          if (isEditing) {
            return (
              <div
                key={part.id}
                className="flex items-center gap-2 rounded bg-white p-2 dark:bg-zinc-800"
              >
                <Input
                  value={displayName}
                  onChange={(e) =>
                    setExistingPartEditState((prev) => ({
                      ...prev,
                      [part.id]: { ...prev[part.id], name: e.target.value },
                    }))
                  }
                  placeholder="Part name"
                  className="h-7 flex-1 text-xs"
                  disabled={isSubmitting}
                />
                <Input
                  type="number"
                  value={displayQty}
                  onChange={(e) =>
                    setExistingPartEditState((prev) => ({
                      ...prev,
                      [part.id]: {
                        ...prev[part.id],
                        quantity: e.target.value,
                      },
                    }))
                  }
                  min="1"
                  step="1"
                  className="h-7 w-16 text-xs"
                  disabled={isSubmitting}
                />
                <Input
                  type="number"
                  value={displayCost}
                  onChange={(e) =>
                    setExistingPartEditState((prev) => ({
                      ...prev,
                      [part.id]: {
                        ...prev[part.id],
                        unit_cost: e.target.value,
                      },
                    }))
                  }
                  min="0"
                  step="0.01"
                  className="h-7 w-20 text-xs"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() =>
                    setExistingPartEditState((prev) => {
                      const next = { ...prev };
                      delete next[part.id];
                      return next;
                    })
                  }
                  disabled={isSubmitting}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-medium text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-emerald-900/20"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          }

          return (
            <div
              key={part.id}
              className="flex items-center gap-2 rounded bg-white p-2 dark:bg-zinc-800"
            >
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  {displayName}
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  {qty} × ${cost.toFixed(2)} = {fmt(rowTotal)}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setExistingPartEditState((prev) => ({
                    ...prev,
                    [part.id]: {
                      id: part.id,
                      name: part.name,
                      quantity: String(part.quantity),
                      unit_cost: String(part.unit_cost),
                    },
                  }))
                }
                disabled={isSubmitting}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-zinc-400 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setPartsToDelete((prev) => [
                    ...prev,
                    { id: part.id, name: part.name },
                  ])
                }
                disabled={isSubmitting}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
