"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit3, Search, FileText, Download, Eye, EyeOff, ExternalLink } from "lucide-react";
import PdfUploadField from "@/app/admin/components/PdfUploadField";
import ImageUploadField from "@/app/admin/components/ImageUploadField";

interface Whitepaper {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string | null;
  coverImageUrl: string | null;
  fileKey: string;
  fileName: string;
  fileSize: number;
  category: string | null;
  author: string | null;
  displayOrder: number;
  isPublished: boolean;
  downloadCount: number;
  createdAt: string;
}

interface WhitepapersApiResponse {
  whitepapers: Whitepaper[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

async function apiFetch<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...opts });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return (await res.json()) as T;
}

export default function AdminWhitepapersPage() {
  const [whitepapers, setWhitepapers] = useState<Whitepaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Whitepaper | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    longDescription: "",
    coverImageUrl: "" as string | null,
    fileKey: "",
    fileName: "",
    fileSize: 1024 * 1024 * 2, // 2MB default
    category: "Security Architecture",
    author: "Privitty Security Research",
    displayOrder: 0,
    isPublished: true,
  });

  const fetchWhitepapers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const data = await apiFetch<WhitepapersApiResponse>(
        `/api/admin/whitepapers?${params.toString()}`
      );
      setWhitepapers(data.whitepapers || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load whitepapers");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchWhitepapers(); // eslint-disable-line react-hooks/set-state-in-effect -- data-fetch on filter change
  }, [fetchWhitepapers]);

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }

  function openCreate() {
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      shortDescription: "",
      longDescription: "",
      coverImageUrl: null,
      fileKey: "",
      fileName: "",
      fileSize: 1024 * 1024 * 2,
      category: "Security Architecture",
      author: "Privitty Security Research",
      displayOrder: whitepapers.length,
      isPublished: true,
    });
    setShowForm(true);
  }

  function openEdit(item: Whitepaper) {
    setEditing(item);
    setForm({
      title: item.title,
      slug: item.slug,
      shortDescription: item.shortDescription,
      longDescription: item.longDescription ?? "",
      coverImageUrl: item.coverImageUrl,
      fileKey: item.fileKey,
      fileName: item.fileName,
      fileSize: item.fileSize,
      category: item.category ?? "Security Architecture",
      author: item.author ?? "Privitty Security Research",
      displayOrder: item.displayOrder,
      isPublished: item.isPublished,
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this whitepaper? The PDF and cover image will also be removed from storage.")) return;
    try {
      await apiFetch(`/api/admin/whitepapers/${id}`, { method: "DELETE" });
      setWhitepapers((prev) => prev.filter((w) => w.id !== id));
    } catch (e: unknown) {
      alert("Delete failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
  }

  async function togglePublish(w: Whitepaper) {
    try {
      const updated = await apiFetch<Whitepaper>(`/api/admin/whitepapers/${w.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !w.isPublished }),
      });
      setWhitepapers((prev) =>
        prev.map((item) => (item.id === w.id ? { ...item, isPublished: updated.isPublished } : item))
      );
    } catch (e: unknown) {
      alert("Status toggle failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Require PDF file
    if (!form.fileKey) {
      alert("Please upload a PDF file before publishing.");
      return;
    }
    try {
      const payload = {
        ...form,
        coverImageUrl: form.coverImageUrl || null,
      };

      if (editing) {
        const updated = await apiFetch<Whitepaper>(`/api/admin/whitepapers/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setWhitepapers((prev) =>
          prev.map((item) => (item.id === editing.id ? updated : item))
        );
      } else {
        const created = await apiFetch<Whitepaper>("/api/admin/whitepapers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setWhitepapers((prev) => [...prev, created]);
      }
      setShowForm(false);
    } catch (e: unknown) {
      alert("Save failed: " + (e instanceof Error ? e.message : "Validation error"));
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Whitepapers &amp; Research</h1>
          <p className="text-sm text-gray-400">
            Publish technical architecture blueprints, configure PDF documents, and track verified download counts.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6750A4] hover:bg-[#574092] text-white text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Whitepaper</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-[#1D1829]/70 backdrop-blur-md p-3 rounded-2xl border border-white/10">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search whitepaper title, category, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#120F1D] text-white text-xs rounded-xl pl-9 pr-4 py-2.5 border border-white/10 focus:outline-none focus:border-[#6750A4]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#120F1D] text-gray-300 text-xs rounded-xl px-3 py-2.5 border border-white/10 focus:outline-none focus:border-[#6750A4]"
        >
          <option value="all">All Status</option>
          <option value="published">Published Only</option>
          <option value="draft">Drafts Only</option>
        </select>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Whitepaper Cards */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          Loading whitepapers from PostgreSQL...
        </div>
      ) : whitepapers.length === 0 ? (
        <div className="bg-[#1D1829]/50 rounded-2xl border border-white/10 p-12 text-center text-gray-400 text-sm">
          No whitepapers found. Click &quot;Upload Whitepaper&quot; to publish your first technical paper.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {whitepapers.map((w) => (
            <div
              key={w.id}
              className="bg-[#1D1829]/90 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#6750A4]/20 text-[#D8CEF6] border border-[#6750A4]/30">
                    {w.category || "Security Architecture"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-medium">
                      {w.downloadCount} downloads
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        w.isPublished
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {w.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white leading-snug">{w.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                    <span>Slug: /{w.slug}</span>
                    <span>•</span>
                    <span>{formatBytes(w.fileSize)}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                  {w.shortDescription}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-2 border-t border-white/5">
                  <FileText className="w-3.5 h-3.5 text-[#B39DDB]" />
                  <span className="truncate max-w-[240px]">{w.fileName}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => togglePublish(w)}
                    className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {w.isPublished ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                        <span>Unpublish</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`/api/whitepapers/${w.slug}/download`}
                    className="text-[#B39DDB] hover:text-white flex items-center gap-1 transition-colors"
                    title="Test PDF Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/whitepapers/${w.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    title="View Public Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => openEdit(w)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181424] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editing ? "Edit Whitepaper" : "Publish New Whitepaper"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Document Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm({
                      ...form,
                      title,
                      slug: editing ? form.slug : generateSlug(title),
                    });
                  }}
                  className="w-full bg-[#100D1A] text-white rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#6750A4] focus:outline-none"
                  placeholder="e.g. Identity-First Architecture for Zero-Trust Operational Technology"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })}
                    className="w-full bg-[#100D1A] text-white rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#6750A4] focus:outline-none font-mono text-[11px]"
                    placeholder="e.g. identity-first-zero-trust-ot"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#100D1A] text-white rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#6750A4] focus:outline-none"
                    placeholder="e.g. Security Architecture, Threat Defense"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">Author / Research Group</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full bg-[#100D1A] text-white rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#6750A4] focus:outline-none"
                  placeholder="e.g. Privitty Security Research"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">Executive Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full bg-[#100D1A] text-white rounded-xl p-3.5 border border-white/10 focus:border-[#6750A4] focus:outline-none leading-relaxed"
                  placeholder="Brief synopsis displayed on cards and search snippets..."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">Detailed Abstract / Long Description</label>
                <textarea
                  rows={4}
                  value={form.longDescription}
                  onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                  className="w-full bg-[#100D1A] text-white rounded-xl p-3.5 border border-white/10 focus:border-[#6750A4] focus:outline-none leading-relaxed"
                  placeholder="Full scope, architectural blueprint summary, and research findings..."
                />
              </div>

              {/* PDF Upload Field */}
              <PdfUploadField
                label="PDF Document *"
                fileKey={form.fileKey || null}
                fileName={form.fileName || null}
                fileSize={form.fileSize || null}
                onChange={({ fileKey, fileName, fileSize }) => {
                  setForm({
                    ...form,
                    fileKey: fileKey || "",
                    fileName: fileName || "",
                    fileSize: fileSize || 0,
                  });
                }}
                downloadSlug={editing?.slug}
              />

              {/* Cover Image Upload */}
              <ImageUploadField
                label="Cover Image (Optional)"
                value={form.coverImageUrl}
                onChange={(value) => setForm({ ...form, coverImageUrl: value })}
                folder="whitepapers"
                aspectRatio="wide"
                helperText="PNG, JPG, or WebP up to 5MB. Used on whitepaper cards."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Display Order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#100D1A] text-white rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#6750A4] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isPublishedWp"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-[#6750A4] focus:ring-0 bg-[#100D1A] border-white/20"
                  />
                  <label htmlFor="isPublishedWp" className="text-gray-300 font-medium cursor-pointer">
                    Publish to Public Website
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#6750A4] hover:bg-[#574092] text-white font-semibold transition-colors shadow-md cursor-pointer"
                >
                  {editing ? "Save Changes" : "Publish Whitepaper"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
