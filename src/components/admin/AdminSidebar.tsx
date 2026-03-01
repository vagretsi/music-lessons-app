"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  Users,
  Calendar,
  CreditCard,
  GraduationCap,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/lessons", label: "Lessons", icon: Video },
  { href: "/admin/teachers", label: "Teachers", icon: GraduationCap },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-gold/10 bg-ink-50 flex flex-col">
      <div className="p-6 border-b border-gold/10">
        <p className="text-gold/60 tracking-[0.3em] uppercase text-xs mb-1">Admin</p>
        <p className="font-display text-xl text-cream">Control Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href) && link.href !== "/admin";
          const exactActive = pathname === link.href;
          const isActive = link.exact ? exactActive : active;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 group",
                isActive
                  ? "bg-gold/10 border border-gold/30 text-gold"
                  : "text-cream/50 hover:text-cream hover:bg-gold/5 border border-transparent"
              )}
            >
              <link.icon size={16} />
              <span className="flex-1">{link.label}</span>
              {isActive && <ChevronRight size={14} className="text-gold/50" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gold/10">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 text-cream/30 hover:text-cream/60 text-sm transition-colors"
        >
          <ChevronRight size={16} className="rotate-180" />
          Back to Dashboard
        </Link>
      </div>
    </aside>
  );
}
