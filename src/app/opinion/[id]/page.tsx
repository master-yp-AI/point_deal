"use client";

import { useRef, useEffect, useState, use } from "react";
import Link from "next/link";
import Sparkline from "@/components/Sparkline";
import TradeModal from "@/components/TradeModal";
import { opinions, debates } from "@/lib/mock-data";

export default function OpinionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const opinion = opinions.find((o) => o.id === id);
  const relatedDebates = debates.filter((d) => d.opinionId === id);
  const [tradeOpen, setTradeOpen] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!opinion || !chartRef.current) return;
    const canvas = chartRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const data = opinion.priceHistory;
    const min = Math.min(...data) * 0.95;
    const max = Math.max(...data) * 1.05;
    const range = max - min || 1;
    const isUp = data[data.length - 1] >= data[0];

    // Grid lines
    ctx.strokeStyle = "rgba(226, 232, 240, 0.8)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      const y = (i / 4) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();

      // Price labels
      const price = max - (i / 4) * range;
      ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
      ctx.font = "11px monospace";
      ctx.fillText(price.toFixed(0), 4, y - 4);
    }

    // Price line
    ctx.beginPath();
    ctx.strokeStyle = isUp ? "#67c23a" : "#f56c6c";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";

    for (let i = 0; i < data.length; i++) {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((data[i] - min) / range) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Gradient fill
    const lastX = w;
    const lastY = h - ((data[data.length - 1] - min) / range) * h;
    ctx.lineTo(lastX, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, isUp ? "rgba(103, 194, 58, 0.15)" : "rgba(245, 108, 108, 0.12)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fill();

    // Current price dot
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = isUp ? "#67c23a" : "#f56c6c";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
    ctx.fillStyle = isUp ? "rgba(103, 194, 58, 0.15)" : "rgba(245, 108, 108, 0.12)";
    ctx.fill();
  }, [opinion]);

  if (!opinion) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p style={{ color: "var(--text-secondary)" }}>观点不存在</p>
        <Link href="/" className="btn btn-primary mt-4">
          返回首页
        </Link>
      </div>
    );
  }

  const change = opinion.price - opinion.previousPrice;
  const changePercent = ((change / opinion.previousPrice) * 100).toFixed(1);
  const isUp = change >= 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        <Link href="/" className="hover:text-[var(--accent-blue)]">行情</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>观点详情</span>
      </div>

      {/* Header */}
      <div
        className="rounded-lg p-6 mb-4"
        style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="badge badge-blue">{opinion.topic}</span>
          {opinion.trending && <span className="badge badge-gold">热</span>}
        </div>
        <h1 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>{opinion.content}</h1>
        <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <span>{opinion.author}</span>
          <span>·</span>
          <span>发布于 {opinion.createdAt}</span>
          <span>·</span>
          <span>{opinion.holders} 人持有</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Chart */}
        <div
          className="col-span-2 rounded-lg p-5"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-mono text-3xl font-bold">{opinion.price}</div>
              <div
                className={`font-mono text-sm font-medium ${isUp ? "glow-green" : "glow-red"}`}
                style={{ color: isUp ? "var(--accent-green)" : "var(--accent-red)" }}
              >
                {isUp ? "+" : ""}{change} ({isUp ? "+" : ""}{changePercent}%)
              </div>
            </div>
            <div className="flex gap-2">
              {["1天", "7天", "30天"].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1 rounded-full text-xs transition-all"
                  style={{
                    background: period === "30天" ? "var(--accent-blue)" : "transparent",
                    color: period === "30天" ? "#ffffff" : "var(--text-secondary)",
                    border: period === "30天" ? "none" : "1px solid var(--border)",
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <canvas
            ref={chartRef}
            className="w-full"
            style={{ height: 200 }}
          />
        </div>

        {/* Trade Panel */}
        <div
          className="rounded-lg p-5 flex flex-col"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <h3 className="font-bold mb-4">快速交易</h3>
          <div className="flex-1 flex flex-col gap-3">
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "var(--bg-secondary)" }}
            >
              <div className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>当前价格</div>
              <div className="font-mono text-2xl font-bold" style={{ color: "var(--accent-blue)" }}>
                {opinion.price} <span className="text-sm">积分</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs" style={{ color: "var(--text-secondary)" }}>
              <div className="rounded-lg p-2" style={{ background: "var(--bg-secondary)" }}>
                <div className="font-mono font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                  {opinion.holders}
                </div>
                <div>持有人</div>
              </div>
              <div className="rounded-lg p-2" style={{ background: "var(--bg-secondary)" }}>
                <div className="font-mono font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                  {opinion.debates}
                </div>
                <div>辩论数</div>
              </div>
              <div className="rounded-lg p-2" style={{ background: "var(--bg-secondary)" }}>
                <div
                  className="font-mono font-bold text-sm"
                  style={{ color: isUp ? "var(--accent-green)" : "var(--accent-red)" }}
                >
                  {isUp ? "+" : ""}{changePercent}%
                </div>
                <div>涨跌</div>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <button className="btn btn-green w-full py-3" onClick={() => setTradeOpen(true)}>
                📈 买入
              </button>
              <button className="btn btn-red w-full py-3" onClick={() => setTradeOpen(true)}>
                📉 卖出
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Debates */}
      <div
        className="rounded-lg p-5"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">相关辩论</h3>
          <Link href="/debate" className="text-sm" style={{ color: "var(--accent-blue)" }}>
            查看全部 →
          </Link>
        </div>
        {relatedDebates.length > 0 ? (
          <div className="flex flex-col gap-3">
            {relatedDebates.map((debate) => (
              <Link key={debate.id} href={`/debate/${debate.id}`}>
                <div
                  className="rounded-xl p-4 transition-all hover:border-[var(--accent-blue)]"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${debate.status === "ongoing" ? "pulse-dot" : ""}`}
                        style={{
                          background:
                            debate.status === "ongoing" ? "var(--accent-green)" :
                            debate.status === "recruiting" ? "var(--accent-blue)" :
                            debate.status === "voting" ? "var(--accent-gold)" : "var(--text-secondary)",
                        }}
                      />
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {debate.status === "ongoing" ? "进行中" :
                         debate.status === "recruiting" ? "招募中" :
                         debate.status === "voting" ? "投票中" : "已结算"}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold" style={{ color: "var(--accent-blue)" }}>
                      🏆 {debate.totalPool} 积分池
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span style={{ color: "var(--accent-green)" }}>
                      ✅ {debate.proSide.label} ({debate.proSide.participants}人)
                    </span>
                    <span style={{ color: "var(--text-secondary)" }}>vs</span>
                    <span style={{ color: "var(--accent-red)" }}>
                      ❌ {debate.conSide.label} ({debate.conSide.participants}人)
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8" style={{ color: "var(--text-secondary)" }}>
            <p>暂无相关辩论</p>
            <button className="btn btn-primary mt-3">发起辩论</button>
          </div>
        )}
      </div>

      <TradeModal
        opinionContent={opinion.content}
        currentPrice={opinion.price}
        isOpen={tradeOpen}
        onClose={() => setTradeOpen(false)}
      />
    </div>
  );
}
