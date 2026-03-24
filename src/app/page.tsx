"use client";

import { useState } from "react";
import OpinionCard from "@/components/OpinionCard";
import { opinions } from "@/lib/mock-data";

type SortMode = "hot" | "gainers" | "losers" | "new";

export default function Home() {
  const [sort, setSort] = useState<SortMode>("hot");

  const sorted = [...opinions].sort((a, b) => {
    switch (sort) {
      case "hot":
        return b.holders - a.holders;
      case "gainers":
        return (b.price - b.previousPrice) / b.previousPrice - (a.price - a.previousPrice) / a.previousPrice;
      case "losers":
        return (a.price - a.previousPrice) / a.previousPrice - (b.price - b.previousPrice) / b.previousPrice;
      case "new":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const topMovers = [...opinions]
    .map((o) => ({
      ...o,
      change: ((o.price - o.previousPrice) / o.previousPrice) * 100,
    }))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Ticker Banner */}
      <div
        className="ticker-wrap rounded-lg mb-6 py-2.5 px-4"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="ticker-content gap-8">
          {[...topMovers, ...topMovers].map((o, i) => {
            const isUp = o.change >= 0;
            return (
              <span key={i} className="flex items-center gap-2 text-sm shrink-0">
                <span className="font-medium truncate max-w-[180px]" style={{ color: "var(--text-primary)" }}>{o.content.slice(0, 15)}…</span>
                <span className="font-mono font-bold">{o.price}</span>
                <span
                  className="font-mono text-xs"
                  style={{ color: isUp ? "var(--accent-green)" : "var(--accent-red)" }}
                >
                  {isUp ? "▲" : "▼"} {Math.abs(o.change).toFixed(1)}%
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "总交易额", value: "128,400", icon: "💰" },
          { label: "活跃观点", value: opinions.length.toString(), icon: "💬" },
          { label: "进行中辩论", value: "3", icon: "⚔️" },
          { label: "在线用户", value: "1,247", icon: "👥" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center py-3 rounded-lg"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="font-mono font-bold text-lg" style={{ color: "var(--text-primary)" }}>{stat.value}</div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Sort Tabs */}
      <div className="flex items-center gap-0 mb-4" style={{ borderBottom: "1px solid var(--border)" }}>
        {(
          [
            { key: "hot", label: "热门" },
            { key: "gainers", label: "涨幅榜" },
            { key: "losers", label: "跌幅榜" },
            { key: "new", label: "最新" },
          ] as { key: SortMode; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSort(tab.key)}
            className="px-4 py-2.5 text-sm transition-all relative"
            style={{
              background: "transparent",
              color: sort === tab.key ? "var(--accent-blue)" : "var(--text-secondary)",
              fontWeight: sort === tab.key ? 600 : 400,
              border: "none",
            }}
          >
            {tab.label}
            {sort === tab.key && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{ width: 24, height: 3, borderRadius: 2, background: "var(--accent-blue)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Opinion List */}
      <div className="flex flex-col">
        {sorted.map((opinion) => (
          <OpinionCard key={opinion.id} opinion={opinion} />
        ))}
      </div>
    </div>
  );
}
