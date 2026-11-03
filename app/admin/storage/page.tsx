"use client";

import React, { useState } from "react";
import {
  HardDrive,
  Search,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  ImageIcon,
  FolderOpen,
} from "lucide-react";

interface OrphanFile {
  key: string;
  size: number;
  folder: string;
  lastModified: string | null;
}

interface ScanSummary {
  totalFilesScanned: number;
  referencedFiles: number;
  orphanCount: number;
  totalOrphanBytes: number;
}

interface CleanupResult {
  deleted: string[];
  failed: { key: string; error: string }[];
  summary: { requested: number; deleted: number; failed: number };
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(key: string) {
  const ext = key.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FileText className="w-4 h-4 text-rose-400" />;
  if (["jpg", "jpeg", "png", "webp", "svg"].includes(ext || ""))
    return <ImageIcon className="w-4 h-4 text-blue-400" />;
  return <FileText className="w-4 h-4 text-gray-400" />;
}

function getFolderColor(folder: string) {
  const colors: Record<string, string> = {
    team: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    whitepapers: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    testimonials: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    partners: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    media: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  };
  return colors[folder] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
}

export default function AdminStoragePage() {
  const [scanning, setScanning] = useState(false);
  const [orphans, setOrphans] = useState<OrphanFile[]>([]);
  const [summary, setSummary] = useState<ScanSummary | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [lastResult, setLastResult] = useState<CleanupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false);

  async function runScan() {
    try {
      setScanning(true);
      setError(null);
      setLastResult(null);
      setSelected(new Set());

      const res = await fetch("/api/admin/storage/orphans", {
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.text();
        throw new Error(`Scan failed: ${errData}`);
      }

      const data = await res.json();
      setOrphans(data.orphans || []);
      setSummary(data.summary || null);
      setHasScanned(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to scan storage");
    } finally {
      setScanning(false);
    }
  }

  function toggleSelect(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function selectAll() {
    if (selected.size === orphans.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(orphans.map((f) => f.key)));
    }
  }

  async function handleDelete() {
    if (selected.size === 0) return;

    const confirmed = confirm(
      `⚠️ PERMANENT DELETION\n\nYou are about to permanently delete ${selected.size} file(s) from S3 storage.\n\nThis action CANNOT be undone. Each file will be verified as unreferenced before deletion.\n\nProceed?`
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      setError(null);

      const res = await fetch("/api/admin/storage/cleanup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: Array.from(selected) }),
      });

      if (!res.ok) {
        const errData = await res.text();
        throw new Error(`Cleanup failed: ${errData}`);
      }

      const result: CleanupResult = await res.json();
      setLastResult(result);

      // Remove successfully deleted files from the orphan list
      const deletedSet = new Set(result.deleted);
      setOrphans((prev) => prev.filter((f) => !deletedSet.has(f.key)));
      setSelected(new Set());

      if (summary) {
        setSummary({
          ...summary,
          orphanCount: summary.orphanCount - result.summary.deleted,
          totalOrphanBytes:
            summary.totalOrphanBytes -
            orphans
              .filter((f) => deletedSet.has(f.key))
              .reduce((sum, f) => sum + f.size, 0),
        });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Cleanup failed");
    } finally {
      setDeleting(false);
    }
  }

  const selectedBytes = orphans
    .filter((f) => selected.has(f.key))
    .reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Storage Management
          </h1>
          <p className="text-sm text-gray-400">
            Scan CMS-managed S3 storage for orphan files and reclaim unused space.
          </p>
        </div>
        <button
          onClick={runScan}
          disabled={scanning}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6750A4] hover:bg-[#574092] text-white text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer shrink-0 disabled:opacity-60"
        >
          {scanning ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>{scanning ? "Scanning..." : "Scan for Orphans"}</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Last Cleanup Result */}
      {lastResult && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              Cleanup complete: {lastResult.summary.deleted} deleted,{" "}
              {lastResult.summary.failed} failed
            </span>
          </div>
          {lastResult.failed.length > 0 && (
            <div className="space-y-1 mt-2">
              <p className="text-xs text-amber-300 font-medium">
                Failed deletions (can retry):
              </p>
              {lastResult.failed.map((f) => (
                <div
                  key={f.key}
                  className="text-[11px] text-gray-400 font-mono pl-4"
                >
                  {f.key}: {f.error}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#1D1829]/90 border border-white/10 rounded-xl p-4">
            <div className="text-[11px] text-gray-400 font-medium">
              Total Files Scanned
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {summary.totalFilesScanned}
            </div>
          </div>
          <div className="bg-[#1D1829]/90 border border-white/10 rounded-xl p-4">
            <div className="text-[11px] text-gray-400 font-medium">
              Referenced (In Use)
            </div>
            <div className="text-xl font-bold text-emerald-300 mt-1">
              {summary.referencedFiles}
            </div>
          </div>
          <div className="bg-[#1D1829]/90 border border-white/10 rounded-xl p-4">
            <div className="text-[11px] text-gray-400 font-medium">
              Orphan Files
            </div>
            <div className="text-xl font-bold text-amber-300 mt-1">
              {summary.orphanCount}
            </div>
          </div>
          <div className="bg-[#1D1829]/90 border border-white/10 rounded-xl p-4">
            <div className="text-[11px] text-gray-400 font-medium">
              Recoverable Space
            </div>
            <div className="text-xl font-bold text-[#B39DDB] mt-1">
              {formatBytes(summary.totalOrphanBytes)}
            </div>
          </div>
        </div>
      )}

      {/* Orphan File List */}
      {hasScanned && (
        <>
          {orphans.length === 0 ? (
            <div className="bg-[#1D1829]/50 rounded-2xl border border-white/10 p-12 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm text-emerald-300 font-semibold">
                Storage is clean!
              </p>
              <p className="text-xs text-gray-400">
                No orphan files found. All files in CMS-managed folders are
                properly referenced in the database.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Bulk Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1D1829]/70 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                    <input
                      type="checkbox"
                      checked={selected.size === orphans.length}
                      onChange={selectAll}
                      className="w-3.5 h-3.5 rounded text-[#6750A4] focus:ring-0 bg-[#100D1A] border-white/20"
                    />
                    Select All ({orphans.length})
                  </label>

                  {selected.size > 0 && (
                    <span className="text-[11px] text-[#B39DDB] font-medium">
                      {selected.size} selected ({formatBytes(selectedBytes)})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={runScan}
                    disabled={scanning}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${scanning ? "animate-spin" : ""}`}
                    />
                    Re-scan
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={selected.size === 0 || deleting}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {deleting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    <span>
                      {deleting
                        ? "Deleting..."
                        : `Delete Selected (${selected.size})`}
                    </span>
                  </button>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  These files exist in S3 storage but are not referenced by any
                  database record. Verify before deleting — this is a dry-run
                  preview. Files that become referenced before deletion will be
                  safely skipped.
                </span>
              </div>

              {/* File List */}
              <div className="bg-[#1D1829]/60 rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
                {orphans.map((file) => (
                  <div
                    key={file.key}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                      selected.has(file.key) ? "bg-[#6750A4]/10" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(file.key)}
                      onChange={() => toggleSelect(file.key)}
                      className="w-3.5 h-3.5 rounded text-[#6750A4] focus:ring-0 bg-[#100D1A] border-white/20 cursor-pointer shrink-0"
                    />

                    {getFileIcon(file.key)}

                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white font-mono truncate">
                        {file.key}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getFolderColor(
                            file.folder
                          )}`}
                        >
                          {file.folder}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {formatBytes(file.size)}
                        </span>
                        {file.lastModified && (
                          <span className="text-[11px] text-gray-500">
                            {new Date(file.lastModified).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Initial state */}
      {!hasScanned && !scanning && (
        <div className="bg-[#1D1829]/50 rounded-2xl border border-white/10 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#6750A4]/15 flex items-center justify-center mx-auto">
            <HardDrive className="w-7 h-7 text-[#B39DDB]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Orphan File Scanner
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              Scans all CMS-managed S3 folders (team, whitepapers, testimonials,
              partners, media) and identifies files not referenced by any database
              record. Nothing is deleted until you explicitly confirm.
            </p>
          </div>
          <button
            onClick={runScan}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6750A4] hover:bg-[#574092] text-white text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer mx-auto"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Start Scan</span>
          </button>
        </div>
      )}
    </div>
  );
}
