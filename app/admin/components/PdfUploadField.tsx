"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  X,
  RefreshCw,
  FileText,
  Loader2,
  Download,
  CheckCircle2,
} from "lucide-react";

interface PdfUploadFieldProps {
  label: string;
  /** The S3 file key (or null if no file uploaded yet) */
  fileKey: string | null;
  /** Original filename for display */
  fileName: string | null;
  /** File size in bytes */
  fileSize: number | null;
  /** Called when a file is uploaded, replaced, or removed */
  onChange: (data: {
    fileKey: string | null;
    fileName: string | null;
    fileSize: number | null;
  }) => void;
  /** S3 folder for uploads */
  folder?: "whitepapers";
  helperText?: string;
  /** Slug for generating download link */
  downloadSlug?: string;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function PdfUploadField({
  label,
  fileKey,
  fileName,
  fileSize,
  onChange,
  folder = "whitepapers",
  helperText = "PDF documents up to 25MB",
  downloadSlug,
}: PdfUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Client-side validation: MIME type
    if (file.type !== "application/pdf") {
      setError("Invalid file type. Only PDF documents (.pdf) are accepted.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Client-side validation: extension
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Invalid file extension. File must have a .pdf extension.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Client-side validation: size (25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError(
        `File size (${formatBytes(file.size)}) exceeds the 25MB limit.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setUploading(true);
      setUploadProgress("Requesting upload authorization...");

      // 1. Get presigned URL from server
      const presignRes = await fetch("/api/admin/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          folder,
          filename: file.name,
          contentType: file.type,
          sizeBytes: file.size,
        }),
      });

      const presignData = await presignRes.json();
      if (!presignRes.ok) {
        throw new Error(presignData.error || "Failed to initialize upload");
      }

      // 2. Upload binary to S3 or local endpoint
      setUploadProgress("Uploading PDF to secure storage...");
      const uploadRes = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        let errorDetail = `Upload failed with status ${uploadRes.status}`;
        try {
          const errBody = await uploadRes.json();
          if (errBody?.error) {
            errorDetail = errBody.error;
          }
        } catch {
          const errText = await uploadRes.text().catch(() => "");
          if (errText) errorDetail = errText;
        }
        throw new Error(errorDetail);
      }

      setUploadProgress("Upload complete!");

      // 3. Return the file details to parent form
      onChange({
        fileKey: presignData.fileKey,
        fileName: file.name,
        fileSize: file.size,
      });
    } catch (err: unknown) {
      console.error("PDF upload failed:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange({ fileKey: null, fileName: null, fileSize: null });
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const hasFile = !!fileKey;

  return (
    <div className="space-y-2">
      <label className="block text-gray-300 font-medium text-xs">{label}</label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* File Preview or Upload Zone */}
      {hasFile ? (
        <div className="p-4 rounded-2xl bg-[#100D1A] border border-white/10 space-y-3">
          {/* File info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6750A4]/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#B39DDB]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white font-medium truncate">
                {fileName || "Uploaded PDF"}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {fileSize && (
                  <span className="text-[11px] text-gray-400">
                    {formatBytes(fileSize)}
                  </span>
                )}
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Uploaded
                </span>
              </div>
            </div>
          </div>

          {/* S3 key display */}
          <div className="text-[10px] text-gray-500 font-mono truncate px-1">
            Key: {fileKey}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              <span>Replace PDF</span>
            </button>

            {downloadSlug && (
              <a
                href={`/api/whitepapers/${downloadSlug}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#6750A4]/20 hover:bg-[#6750A4]/30 text-[#D8CEF6] text-[11px] font-medium transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </a>
            )}

            <button
              type="button"
              disabled={uploading}
              onClick={handleRemove}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/15 hover:border-[#6750A4] bg-[#100D1A]/50 hover:bg-[#100D1A] rounded-2xl p-5 text-center cursor-pointer transition-all group"
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#6750A4]" />
              <span className="text-xs text-gray-300 font-medium">
                {uploadProgress || "Uploading..."}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-1">
              <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-[#6750A4]/20 text-gray-400 group-hover:text-[#D8CEF6] flex items-center justify-center transition-colors">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Click to select and upload PDF
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {helperText}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-[11px] text-rose-400">{error}</p>}
    </div>
  );
}
