"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, RefreshCw, Loader2 } from "lucide-react";
import { resolveAssetUrl } from "@/app/lib/media";

interface ImageUploadFieldProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  folder: "testimonials" | "partners" | "team" | "media" | "whitepapers";
  aspectRatio?: "square" | "wide";
  helperText?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  aspectRatio = "square",
  helperText = "PNG, JPG, WebP, or SVG up to 5MB",
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = value ? resolveAssetUrl(value) : null;

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate mime type
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedMimes.includes(file.type)) {
      setError("Invalid format. Please select a PNG, JPG, WebP, or SVG image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate size (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError(
        `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds 5MB limit.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setUploading(true);

      // 1. Request presigned URL from existing API
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

      // 2. Upload file binary directly to S3 or local endpoint
      const uploadRes = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
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
          // If not JSON, try text
          const errText = await uploadRes.text().catch(() => "");
          if (errText) errorDetail = errText;
        }
        throw new Error(errorDetail);
      }

      // 3. Save the resulting fileKey in PostgreSQL form state
      onChange(presignData.fileKey);
    } catch (err: unknown) {
      console.error("Image upload failed:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <label className="block text-gray-300 font-medium text-xs">{label}</label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Preview Card or Upload Zone */}
      {previewUrl ? (
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#100D1A] border border-white/10">
          <div
            className={`relative rounded-xl overflow-hidden bg-slate-900 border border-white/15 shrink-0 flex items-center justify-center ${
              aspectRatio === "square"
                ? "w-16 h-16 rounded-full"
                : "w-28 h-14 rounded-lg p-1.5"
            }`}
          >
            <Image
              src={previewUrl}
              alt="Uploaded preview"
              fill
              className={
                aspectRatio === "square" ? "object-cover" : "object-contain"
              }
              unoptimized
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="text-[11px] text-gray-300 font-mono truncate">
              {value}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                <span>Replace</span>
              </button>

              <button
                type="button"
                disabled={uploading}
                onClick={handleRemove}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
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
                Uploading to S3 storage...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-1">
              <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-[#6750A4]/20 text-gray-400 group-hover:text-[#D8CEF6] flex items-center justify-center transition-colors">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Click to select and upload image
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{helperText}</p>
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
