"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareQuote,
  Building2,
  Users,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  ChevronRight,
  HardDrive,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(!isLoginPage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (isLoginPage) return;

    fetch("/api/admin/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isLoginPage, router, pathname]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F1FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#6750A4]/30 border-t-[#6750A4] rounded-full animate-spin" />
          <p className="text-sm font-medium text-[#625F6B]">Verifying admin session...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "Partners",
      href: "/admin/partners",
      icon: Building2,
      active: pathname.startsWith("/admin/partners"),
    },
    {
      label: "Testimonials",
      href: "/admin/testimonials",
      icon: MessageSquareQuote,
      active: pathname.startsWith("/admin/testimonials"),
    },
    {
      label: "Team Members",
      href: "/admin/team",
      icon: Users,
      active: pathname.startsWith("/admin/team"),
    },
    {
      label: "Whitepapers",
      href: "/admin/whitepapers",
      icon: FileText,
      active: pathname.startsWith("/admin/whitepapers"),
    },
    {
      label: "Media Library",
      href: "/admin/media",
      icon: ImageIcon,
      active: pathname.startsWith("/admin/media"),
    },
    {
      label: "Storage",
      href: "/admin/storage",
      icon: HardDrive,
      active: pathname.startsWith("/admin/storage"),
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
      active: pathname.startsWith("/admin/settings"),
    },
  ];

  const currentNav = navItems.find((item) => item.active) || navItems[0];

  return (
    <div className="min-h-screen bg-[#F8F5FF] flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 flex-col justify-between bg-white border-r border-[#DDD8E8] shrink-0 sticky top-0 h-screen z-20">
        <div>
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-[#DDD8E8] flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#5933AA] flex items-center justify-center text-white shadow-sm group-hover:bg-[#4F378A] transition-colors">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-[#17151D] font-headline">
                  Privitty
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6750A4]">
                  CMS Studio
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#7A7589]">
              Content Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    item.active
                      ? "bg-[#F3EEFC] text-[#553C9A] shadow-xs"
                      : "text-[#625F6B] hover:text-[#17151D] hover:bg-[#FAF8FF]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      item.active ? "text-[#553C9A]" : "text-[#7A7589]"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#DDD8E8] space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#FAF8FF] border border-[#E8E2F4] text-xs font-semibold text-[#553C9A] hover:bg-[#F3EEFC] transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              View Live Website
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#7A7589]" />
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#5933AA] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-bold text-[#17151D] truncate">
                  {user?.name || "Administrator"}
                </div>
                <div className="text-[11px] text-[#7A7589] truncate">
                  {user?.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sign out"
              aria-label="Sign out"
              className="p-1.5 text-[#7A7589] hover:text-[#D32F2F] hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-[#DDD8E8] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#625F6B] hover:bg-gray-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#17151D] font-headline tracking-tight">
                {currentNav.label}
              </h1>
              <p className="text-[11px] text-[#7A7589] hidden sm:block">
                Secure Content Management System &bull; Privitty Zero-Trust Security
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production EC2 Ready</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl border border-[#DDD8E8] bg-white hover:bg-[#FAF8FF] text-xs font-semibold text-[#17151D] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#553C9A]" />
              <span className="hidden sm:inline">Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-3 py-1.5 rounded-xl bg-[#5933AA] hover:bg-[#4F378A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#DDD8E8] p-4 space-y-2 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                    item.active
                      ? "bg-[#F3EEFC] text-[#553C9A]"
                      : "text-[#625F6B] hover:bg-[#FAF8FF]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#DDD8E8] flex justify-between items-center text-xs">
              <span className="text-[#7A7589]">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
