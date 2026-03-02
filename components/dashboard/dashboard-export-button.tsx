"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import { fetchJobs, type VJobsRow } from "@/hooks/jobs/useFetchJobs";
import type { TechnicianDetailRow } from "@/hooks/technicians/useFetchTechnicians";
import {
  buildDashboardExportReport,
  exportDashboardReportAsExcel,
  exportDashboardReportAsPdf,
  type ExportFormat,
} from "@/lib/dashboard-export";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DashboardExportButtonProps {
  currentJobs: VJobsRow[];
  technicians: TechnicianDetailRow[];
  techNameMap: Map<string, string>;
}

export function DashboardExportButton({
  currentJobs,
  technicians,
  techNameMap,
}: DashboardExportButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(
    null,
  );
  const [isExporting, setIsExporting] = useState(false);

  const requestExport = (format: ExportFormat) => {
    setSelectedFormat(format);
    setDialogOpen(true);
  };

  const runExport = async (scope: "current" | "all") => {
    if (!selectedFormat) return;

    setIsExporting(true);
    try {
      const jobsToExport =
        scope === "current" ? currentJobs : await fetchJobs({ mode: "all" });

      const report = buildDashboardExportReport({
        jobs: jobsToExport,
        technicians,
        techNameMap,
        scopeLabel: scope === "current" ? "Current Filter" : "All Records",
      });

      if (selectedFormat === "excel") {
        await exportDashboardReportAsExcel(report);
      } else {
        await exportDashboardReportAsPdf(report);
      }

      toast.success(
        `Exported ${selectedFormat.toUpperCase()} report (${report.scopeLabel}).`,
      );
      setDialogOpen(false);
      setSelectedFormat(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to export dashboard report.";
      toast.error(message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="size-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => requestExport("pdf")}>
            <FileText className="size-4" />
            Export PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => requestExport("excel")}>
            <FileSpreadsheet className="size-4" />
            Export Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent showCloseButton={!isExporting} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose export scope</DialogTitle>
            <DialogDescription>
              Export as {selectedFormat?.toUpperCase() ?? "file"}. Do you want
              to apply the current dashboard filter, or export all records?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setSelectedFormat(null);
              }}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => runExport("current")}
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Use Current Filter"}
            </Button>
            <Button onClick={() => runExport("all")} disabled={isExporting}>
              {isExporting ? "Exporting..." : "Export All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
