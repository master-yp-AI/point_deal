"use client";

import Link from "next/link";
import { debates } from "@/lib/mock-data";

const statusLabels: Record<string, { label: string; color: string }> = {
  recruiting: { label: "🟢 招募中", color: "var(--accent-blue)" },
  ongoing: { label: "🔴 进行中", color: "var(--accent-green)" },
  voting: { label: "🟡 投票中", color: "var(--accent-gold)" },
  settled: { label: "⚪ 已结算", color: "var(--text-secondary)" },
};

export default function DebateListPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">辩论场</h1>
        <button className="btn btn-primary">发起辩论</button>
      </div>

      <div className="flex flex-col gap-4">
        {debates.map((debate) => {
          const statusInfo = statusLabels[debate.status];
          const proPercent = Math.round(
            (debate.proSide.totalBet / debate.totalPool) * 100
          );
          return (
            <Link key={debate.id} href={`/debate/${debate.id}`}>
              <div className="card p-5 cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`badge ${
                          debate.status === "ongoing"
                            ? "badge-green"
                            : debate.status === "recruiting"
                            ? "badge-blue"
                            : debate.status === "voting"
                            ? "badge-gold"
                            : "badge-purple"
                        }`}
                      >
                        {statusInfo.label}
                      </span>
                      <span className="badge badge-blue">{debate.topic}</span>
                    </div>
                    <p className="font-medium text-base">{debate.opinionContent}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className="font-mono text-lg font-bold"
                      style={{ color: "var(--accent-blue)" }}
                    >
                      {debate.totalPool}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      积分池
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span style={{ color: "var(--accent-green)" }}>
                      ✅ {debate.proSide.label} · {debate.proSide.participants}人 · {debate.proSide.totalBet}积分
                    </span>
                    <span style={{ color: "var(--accent-red)" }}>
                      {debate.conSide.totalBet}积分 · {debate.conSide.participants}人 · {debate.conSide.label} ❌
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden flex"
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    <div
                      className="h-full rounded-l-full transition-all"
                      style={{
                        width: `${proPercent}%`,
                        background: "var(--accent-green)",
                      }}
                    />
                    <div
                      className="h-full rounded-r-full transition-all"
                      style={{
                        width: `${100 - proPercent}%`,
                        background: "var(--accent-red)",
                      }}
                    />
                  </div>
                </div>

                <div
                  className="flex items-center justify-between text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span>开始: {debate.startTime}</span>
                  {debate.status === "ongoing" && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--accent-green)" }} />
                      辩论进行中
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
