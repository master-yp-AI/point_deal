"use client";

import { useState } from "react";

interface TradeModalProps {
  opinionContent: string;
  currentPrice: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function TradeModal({ opinionContent, currentPrice, isOpen, onClose }: TradeModalProps) {
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const total = currentPrice * quantity;

  const handleTrade = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      setQuantity(1);
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.3)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg p-5"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {showSuccess ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">🎉</div>
            <div className="text-lg font-bold mb-1">
              {mode === "buy" ? "买入成功！" : "卖出成功！"}
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {quantity} 份 × {currentPrice} 积分 = {total} 积分
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">交易观点</h3>
              <button onClick={onClose} className="text-xl" style={{ color: "var(--text-secondary)" }}>
                ✕
              </button>
            </div>

            <p className="text-sm mb-4 leading-snug" style={{ color: "var(--text-secondary)" }}>
              {opinionContent}
            </p>

            <div className="flex gap-2 mb-4">
              <button
                className={`btn flex-1 ${mode === "buy" ? "btn-green" : "btn-outline"}`}
                onClick={() => setMode("buy")}
              >
                买入
              </button>
              <button
                className={`btn flex-1 ${mode === "sell" ? "btn-red" : "btn-outline"}`}
                onClick={() => setMode("sell")}
              >
                卖出
              </button>
            </div>

            <div className="mb-4">
              <label className="text-xs mb-1 block" style={{ color: "var(--text-secondary)" }}>
                数量
              </label>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-outline w-10 h-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 h-10 text-center font-mono font-bold rounded-lg"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                  min={1}
                />
                <button
                  className="btn btn-outline w-10 h-10"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div
              className="flex items-center justify-between py-3 px-4 rounded-lg mb-4"
              style={{ background: "var(--bg-secondary)" }}
            >
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {mode === "buy" ? "支付" : "获得"}总计
              </span>
              <span className="font-mono font-bold text-lg" style={{ color: "var(--accent-blue)" }}>
                {total} 积分
              </span>
            </div>

            <button
              className={`btn w-full text-base py-3 ${mode === "buy" ? "btn-green" : "btn-red"}`}
              onClick={handleTrade}
            >
              确认{mode === "buy" ? "买入" : "卖出"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
