"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Users } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CommissionRate } from "@/types/technician";

interface TechnicianFormValues {
  name: string;
  email: string;
  phone: string;
  commissionRate: string;
  hiredAt: string;
}

export function AddTechnicianDialog() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TechnicianFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      commissionRate: "0.75",
      hiredAt: new Date().toISOString().slice(0, 10),
    },
  });

  const commissionRate = watch("commissionRate");

  const onSubmit = (data: TechnicianFormValues) => {
    const technician = {
      id: `tech-${data.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      commissionRate: parseFloat(data.commissionRate) as CommissionRate,
      active: true,
      hiredAt: data.hiredAt,
    };

    console.log("New technician added:", technician);
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
          <Users className="mr-2 h-4 w-4" />
          Add Technician
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Technician</DialogTitle>
          <DialogDescription>
            Register a new technician or sub-contractor.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
              <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Technician added successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="tech-name">Name</Label>
              <Input
                id="tech-name"
                placeholder="Full name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tech-email">Email</Label>
                <Input
                  id="tech-email"
                  type="email"
                  placeholder="tech@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech-phone">Phone</Label>
                <Input
                  id="tech-phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  {...register("phone")}
                />
              </div>
            </div>

            {/* Commission Rate & Hire Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tech-commission">Commission Rate</Label>
                <Select
                  value={commissionRate}
                  onValueChange={(v) => setValue("commissionRate", v)}
                >
                  <SelectTrigger id="tech-commission">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.75">75% — Own Technician</SelectItem>
                    <SelectItem value="0.5">50% — Sub Contractor</SelectItem>
                    <SelectItem value="1">100% — Full Commission</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Business keeps{" "}
                  {Math.round((1 - parseFloat(commissionRate)) * 100)}%
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech-hired">Hire Date</Label>
                <Input
                  id="tech-hired"
                  type="date"
                  {...register("hiredAt", {
                    required: "Hire date is required",
                  })}
                />
                {errors.hiredAt && (
                  <p className="text-xs text-red-500">
                    {errors.hiredAt.message}
                  </p>
                )}
              </div>
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
              <Button type="submit">Add Technician</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
