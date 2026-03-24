"use client";

import { useState, use } from "react";
import Link from "next/link";
import { debates } from "@/lib/mock-data";

export default function DebateRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const debate = debates.find((d) => d.id === id);
  const [inputValue, setInputValue] = useState("");
  const [selectedSide, setSelectedSide] = useState<"pro" | "con" | null>(null);
  const [betAmount, setBetAmount] = useState(50);
  const [joined, setJoined] = useState(false);

  if (!debate) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p style={{ color: "var(--text-secondary)" }}>辩论不存在</p>
        <Link href="/debate" className="btn btn-primary mt-4">返回辩论场</Link>
      </div>
    );
  }

  const proPercent = Math.round((debate.proSide.totalBet / debate.totalPool) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        <Link href="/debate" className="hover:text-[var(--accent-blue)]">辩论场</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>辩论详情</span>
      </div>

      {/* Header */}
      <div
        className="rounded-lg p-5 mb-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-green">
            {debate.status === "ongoing" ? "🔴 进行中" : debate.status === "recruiting" ? "🟢 招募中" : debate.status === "voting" ? "🟡 投票中" : "已结算"}
          </span>
          <span className="badge badge-blue">{debate.topic}</span>
        </div>
        <h1 className="text-lg font-bold mb-3">{debate.opinionContent}</h1>

        {/* Score board */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg p-3 text-center" style={{ background: "#f0f9eb", border: "1px solid #c2e7b0" }}>
            <div className="text-sm mb-1" style={{ color: "var(--accent-green)" }}>✅ {debate.proSide.label}</div>
            <div className="font-mono font-bold text-lg">{debate.proSide.participants}人</div>
            <div className="font-mono text-sm" style={{ color: "var(--accent-blue)" }}>{debate.proSide.totalBet} 积分</div>
          </div>
          <div className="rounded-lg p-3 text-center flex flex-col items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
            <div className="text-2xl font-bold mb-0.5">VS</div>
            <div className="font-mono text-sm" style={{ color: "var(--accent-blue)" }}>🏆 {debate.totalPool}</div>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: "#fef0f0", border: "1px solid #fbc4c4" }}>
            <div className="text-sm mb-1" style={{ color: "var(--accent-red)" }}>❌ {debate.conSide.label}</div>
            <div className="font-mono font-bold text-lg">{debate.conSide.participants}人</div>
            <div className="font-mono text-sm" style={{ color: "var(--accent-blue)" }}>{debate.conSide.totalBet} 积分</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full overflow-hidden flex" style={{ background: "var(--bg-secondary)" }}>
          <div className="h-full" style={{ width: `${proPercent}%`, background: "var(--accent-green)" }} />
          <div className="h-full" style={{ width: `${100 - proPercent}%`, background: "var(--accent-red)" }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Chat area */}
        <div className="col-span-2">
          <div
            className="rounded-lg overflow-hidden flex flex-col"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", height: 480 }}
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {debate.messages.length > 0 ? (
                debate.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-xl p-3 ${msg.side === "pro" ? "side-pro" : "side-con"}`}
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{msg.avatar}</span>
                      <span className="text-sm font-medium">{msg.author}</span>
                      {msg.isAI && <span className="badge badge-purple">🤖 AI分身</span>}
                      <span className="text-xs ml-auto" style={{ color: "var(--text-secondary)" }}>
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <button className="hover:text-[var(--accent-blue)]">👍 {msg.likes}</button>
                      <button className="hover:text-[var(--accent-blue)]">💬 回复</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center" style={{ color: "var(--text-secondary)" }}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏳</div>
                    <p>辩论即将开始，敬请期待...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            {joined && (
              <div className="p-3 flex gap-2" style={{ borderTop: "1px solid var(--border)" }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="发表你的观点..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                />
                <button className="btn btn-primary">发言</button>
              </div>
            )}
          </div>
        </div>

        {/* Join panel */}
        <div
          className="rounded-lg p-5 flex flex-col"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          {!joined ? (
            <>
              <h3 className="font-bold mb-4">加入辩论</h3>
              <div className="flex flex-col gap-3 mb-4">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>选择你的立场：</p>
                <button
                  className={`rounded-lg p-3 text-left transition-all ${selectedSide === "pro" ? "" : ""}`}
                  style={{
                    background: selectedSide === "pro" ? "#f0f9eb" : "var(--bg-secondary)",
                    border: selectedSide === "pro" ? "2px solid #c2e7b0" : "2px solid var(--border)",
                  }}
                  onClick={() => setSelectedSide("pro")}
                >
                  <div style={{ color: "var(--accent-green)" }}>✅ {debate.proSide.label}</div>
                  <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    赔率 {(debate.totalPool / debate.proSide.totalBet).toFixed(2)}x
                  </div>
                </button>
                <button
                  className="rounded-lg p-3 text-left transition-all"
                  style={{
                    background: selectedSide === "con" ? "#fef0f0" : "var(--bg-secondary)",
                    border: selectedSide === "con" ? "2px solid #fbc4c4" : "2px solid var(--border)",
                  }}
                  onClick={() => setSelectedSide("con")}
                >
                  <div style={{ color: "var(--accent-red)" }}>❌ {debate.conSide.label}</div>
                  <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    赔率 {(debate.totalPool / debate.conSide.totalBet).toFixed(2)}x
                  </div>
                </button>
              </div>

              <div className="mb-4">
                <label className="text-sm mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                  押注积分
                </label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
                  className="w-full px-3 py-2 rounded-lg text-center font-mono font-bold"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--accent-blue)",
                    outline: "none",
                  }}
                  min={10}
                />
                <div className="flex gap-2 mt-2">
                  {[50, 100, 200, 500].map((v) => (
                    <button
                      key={v}
                      onClick={() => setBetAmount(v)}
                      className="flex-1 py-1 rounded text-xs font-mono"
                      style={{
                        background: betAmount === v ? "var(--accent-blue)" : "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        color: betAmount === v ? "#ffffff" : "var(--text-secondary)"
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className={`btn w-full py-3 ${selectedSide ? "btn-primary" : "btn-outline"}`}
                disabled={!selectedSide}
                onClick={() => setJoined(true)}
              >
                {selectedSide ? `加入 ${selectedSide === "pro" ? debate.proSide.label : debate.conSide.label} 方` : "请先选择立场"}
              </button>

              <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <button className="btn btn-outline w-full gap-2">
                  🤖 派AI分身上场
                </button>
                <p className="text-xs mt-2 text-center" style={{ color: "var(--text-secondary)" }}>
                  AI将模拟你的观点风格自动参战
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">⚔️</div>
              <div className="text-lg font-bold mb-1">已加入辩论！</div>
              <div className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                押注 {betAmount} 积分于 {selectedSide === "pro" ? debate.proSide.label : debate.conSide.label} 方
              </div>
              <div className="badge badge-gold text-sm px-3 py-1">
                预期赔率 {(debate.totalPool / (selectedSide === "pro" ? debate.proSide.totalBet : debate.conSide.totalBet)).toFixed(2)}x
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
