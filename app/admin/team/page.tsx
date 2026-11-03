"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit3, Search, Eye, EyeOff } from "lucide-react";
import { LinkedInIcon } from "@/app/components/Icons";
import { resolveAssetUrl } from "@/app/lib/media";
import ImageUploadField from "@/app/admin/components/ImageUploadField";

interface TeamMember {
  id: string;
  name: string;
  jobTitle: string;
  bio: string | null;
  photoUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  otherUrl: string | null;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
}

interface TeamApiResponse {
  teamMembers: TeamMember[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function apiFetch<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...opts });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return (await res.json()) as T;
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);

  const [form, setForm] = useState({
    name: "",
    jobTitle: "",
    bio: "",
    photoUrl: "" as string | null,
    linkedinUrl: "",
    twitterUrl: "",
    otherUrl: "",
    displayOrder: 0,
    isPublished: true,
  });

  const fetchMembers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const data = await apiFetch<TeamApiResponse>(
        `/api/admin/team?${params.toString()}`
      );
      setMembers(data.teamMembers || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load team members");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchMembers(); // eslint-disable-line react-hooks/set-state-in-effect -- data-fetch on filter change
  }, [fetchMembers]);
  

  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      jobTitle: "",
      bio: "",
      photoUrl: null,
      linkedinUrl: "",
      twitterUrl: "",
      otherUrl: "",
      displayOrder: members.length,
      isPublished: true,
    });
    setShowForm(true);
  }

  function openEdit(item: TeamMember) {
    setEditing(item);
    setForm({
      name: item.name,
      jobTitle: item.jobTitle,
      bio: item.bio ?? "",
      photoUrl: item.photoUrl,
      linkedinUrl: item.linkedinUrl ?? "",
      twitterUrl: item.twitterUrl ?? "",
      otherUrl: item.otherUrl ?? "",
      displayOrder: item.displayOrder,
      isPublished: item.isPublished,
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this team member? Any uploaded photo will also be deleted from storage.")) return;
    try {
      await apiFetch(`/api/admin/team/${id}`, { method: "DELETE" });
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (e: unknown) {
      alert("Delete failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
  }

  async function togglePublish(m: TeamMember) {
    try {
      const updated = await apiFetch<TeamMember>(`/api/admin/team/${m.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !m.isPublished }),
      });
      setMembers((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, isPublished: updated.isPublished } : item))
      );
    } catch (e: unknown) {
      alert("Status toggle failed: " + (e instanceof Error ? e.message : "Unknown error"));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        photoUrl: form.photoUrl || null,
      };

      if (editing) {
        const updated = await apiFetch<TeamMember>(`/api/admin/team/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setMembers((prev) =>
          prev.map((item) => (item.id === editing.id ? updated : item))
        );
      } else {
        const created = await apiFetch<TeamMember>("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setMembers((prev) => [...prev, created]);
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Members Management</h1>
          <p className="text-sm text-gray-400">
            Manage public team profiles, executive biographies, LinkedIn links, and About page display ordering.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6750A4] hover:bg-[#574092] text-white text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-[#1D1829]/70 backdrop-blur-md p-3 rounded-2xl border border-white/10">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search team member name, title, bio..."
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

      {/* Team Cards List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          Loading team members from PostgreSQL...
        </div>
      ) : members.length === 0 ? (
        <div className="bg-[#1D1829]/50 rounded-2xl border border-white/10 p-12 text-center text-gray-400 text-sm">
          No team members found. Click &quot;Add Team Member&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-[#1D1829]/90 border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5">
                    Order: #{m.displayOrder}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      m.isPublished
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {m.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-800">
                    <Image
                      src={m.photoUrl ? resolveAssetUrl(m.photoUrl) : "/preview.png"}
                      alt={m.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{m.name}</h3>
                    <p className="text-xs font-semibold text-[#B39DDB] truncate">{m.jobTitle}</p>
                    {m.linkedinUrl && (
                      <a
                        href={m.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#B39DDB] mt-1 transition-colors"
                      >
                        <LinkedInIcon className="w-3 h-3 text-[#B39DDB]" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>

                {m.bio && (
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                    {m.bio}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => togglePublish(m)}
                  className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {m.isPublished ? (
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(m)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
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
          <div className="bg-[#181424] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editing ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#100D1A] text-white rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#6750A4] focus:outline-none"
                    placeholder="e.g. Milind Deore"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Job Title / Role *</label>
                  <input
                    type="text"
                    required
                    value={form.jobTitle}
                    onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                    className="w-full bg-[#100D1A] text-white rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#6750A4] focus:outline-none"
                    placeholder="e.g. CTO / Software Engineer"
                  />
                </div>
              </div>

              {/* Image Upload Field - replaces the old text input */}
              <ImageUploadField
                label="Team Member Photo"
                value={form.photoUrl}
                onChange={(value) => setForm({ ...form, photoUrl: value })}
                folder="team"
                aspectRatio="square"
                helperText="JPG, PNG, or WebP up to 5MB. Square photos work best."
              />

              <div>
                <label className="block text-gray-300 mb-1 font-medium">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                  className="w-full bg-[#100D1A] text-white rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#6750A4] focus:outline-none"
                  placeholder="https://www.linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">Short Biography</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full bg-[#100D1A] text-white rounded-xl p-3.5 border border-white/10 focus:border-[#6750A4] focus:outline-none leading-relaxed"
                  placeholder="Brief practitioner profile and technical background..."
                />
              </div>

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
                    id="isPublishedMember"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-[#6750A4] focus:ring-0 bg-[#100D1A] border-white/20"
                  />
                  <label htmlFor="isPublishedMember" className="text-gray-300 font-medium cursor-pointer">
                    Publish to About Page
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
                  {editing ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
