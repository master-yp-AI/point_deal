"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "行情", icon: "📊" },
  { href: "/debate", label: "辩论", icon: "⚔️" },
  { href: "/profile", label: "我的", icon: "👤" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{ background: "#ffffff", borderBottom: "1px solid var(--border)" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span style={{ color: "var(--accent-blue)" }}>观点交易所</span>
        </Link>

        <div className="flex items-center gap-0">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-4 py-4 text-sm transition-all relative"
                style={{
                  color: active ? "var(--accent-blue)" : "var(--text-secondary)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span>{item.label}</span>
                {active && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2"
                    style={{ width: 24, height: 3, borderRadius: 2, background: "var(--accent-blue)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
          style={{ background: "var(--bg-secondary)" }}
        >
          <span>💰</span>
          <span className="font-mono font-bold" style={{ color: "var(--accent-blue)" }}>
            1,580
          </span>
        </div>
      </div>
    </nav>
  );
}
