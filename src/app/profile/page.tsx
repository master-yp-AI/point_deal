"use client";

import Link from "next/link";
import { currentUser, leaderboard } from "@/lib/mock-data";

export default function ProfilePage() {
  const totalHoldingValue = currentUser.holdings.reduce(
    (sum, h) => sum + h.currentPrice * h.quantity,
    0
  );
  const totalProfit = currentUser.holdings.reduce((sum, h) => sum + h.profit, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div
        className="rounded-lg p-6 mb-4"
        style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ background: "var(--bg-secondary)", border: "2px solid var(--border)" }}
          >
            {currentUser.avatar}
          </div>
          <div>
            <h1 className="text-xl font-bold">{currentUser.name}</h1>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <span>全站排名</span>
              <span className="font-mono font-bold" style={{ color: "var(--accent-blue)" }}>
                #{currentUser.rank}
              </span>
              <span className="badge badge-gold">Top {(100 - currentUser.percentile).toFixed(1)}%</span>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            {currentUser.badges.map((badge) => (
              <span key={badge} className="badge badge-purple">{badge}</span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "可用积分", value: currentUser.balance.toLocaleString(), color: "var(--accent-gold)", icon: "💰" },
            { label: "总收益", value: `+${currentUser.totalProfit.toLocaleString()}`, color: "var(--accent-green)", icon: "📈" },
            { label: "持仓市值", value: totalHoldingValue.toLocaleString(), color: "var(--accent-blue)", icon: "💼" },
            { label: "辩论胜率", value: `${Math.round((currentUser.debatesWon / currentUser.debatesTotal) * 100)}%`, color: "var(--accent-purple)", icon: "⚔️" },
            { label: "辩论 W/L", value: `${currentUser.debatesWon}/${currentUser.debatesTotal}`, color: "var(--text-primary)", icon: "🏆" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center py-3 rounded-xl"
              style={{ background: "var(--bg-secondary)" }}
            >
              <div className="text-xl mb-0.5">{stat.icon}</div>
              <div className="font-mono font-bold text-lg" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Holdings */}
        <div
          className="col-span-2 rounded-lg p-5"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h3 className="font-bold mb-4">💼 我的持仓</h3>
          <div className="flex flex-col gap-2">
            {currentUser.holdings.map((holding) => {
              const isUp = holding.profit >= 0;
              return (
                <Link key={holding.opinionId} href={`/opinion/${holding.opinionId}`}>
                  <div
                    className="flex items-center justify-between p-3 rounded-xl transition-all hover:border-[var(--accent-blue)]"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{holding.opinionContent}</p>
                      <div className="flex items-center gap-3 text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                        <span>买入: {holding.buyPrice}</span>
                        <span>现价: {holding.currentPrice}</span>
                        <span>×{holding.quantity} 份</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div
                        className="font-mono font-bold"
                        style={{ color: isUp ? "var(--accent-green)" : "var(--accent-red)" }}
                      >
                        {isUp ? "+" : ""}{holding.profit}
                      </div>
                      <div
                        className="font-mono text-xs"
                        style={{ color: isUp ? "var(--accent-green)" : "var(--accent-red)" }}
                      >
                        {isUp ? "+" : ""}{holding.profitPercent}%
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>持仓总收益</span>
            <span
              className="font-mono font-bold"
              style={{ color: totalProfit >= 0 ? "var(--accent-green)" : "var(--accent-red)" }}
            >
              {totalProfit >= 0 ? "+" : ""}{totalProfit} 积分
            </span>
          </div>
        </div>

        {/* Leaderboard */}
        <div
          className="rounded-lg p-5"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h3 className="font-bold mb-4">🏆 观点身价排行</h3>
          <div className="flex flex-col gap-2">
            {leaderboard.map((entry) => {
              const isMe = entry.name === currentUser.name;
              return (
                <div
                  key={entry.rank}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    background: isMe ? "#ecf5ff" : "var(--bg-secondary)",
                    border: isMe ? "1px solid #b3d8ff" : "1px solid transparent",
                  }}
                >
                  <span
                    className="w-6 text-center font-mono text-sm font-bold"
                    style={{
                      color:
                        entry.rank === 1
                          ? "var(--accent-gold)"
                          : entry.rank <= 3
                          ? "var(--accent-purple)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {entry.badge || entry.rank}
                  </span>
                  <span className="text-lg">{entry.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {entry.name} {isMe && <span className="text-xs" style={{ color: "var(--accent-blue)" }}>(我)</span>}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      胜率 {entry.winRate}%
                    </div>
                  </div>
                  <div className="font-mono text-sm font-bold" style={{ color: "var(--accent-blue)" }}>
                    {(entry.value / 1000).toFixed(1)}k
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
