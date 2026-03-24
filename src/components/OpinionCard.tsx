"use client";

import Link from "next/link";
import Sparkline from "./Sparkline";
import { Opinion } from "@/lib/types";

interface OpinionCardProps {
  opinion: Opinion;
}

export default function OpinionCard({ opinion }: OpinionCardProps) {
  const change = opinion.price - opinion.previousPrice;
  const changePercent = ((change / opinion.previousPrice) * 100).toFixed(1);
  const isUp = change >= 0;

  return (
    <Link href={`/opinion/${opinion.id}`}>
      <div className="card px-4 cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-blue">{opinion.topic}</span>
              {opinion.trending && (
                <span className="badge badge-gold">热</span>
              )}
            </div>
            <p className="text-[15px] font-medium leading-relaxed mb-2 line-clamp-2" style={{ color: "var(--text-primary)" }}>
              {opinion.content}
            </p>
            <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
              <span>{opinion.author}</span>
              <span>·</span>
              <span>{opinion.holders} 人持有</span>
              <span>·</span>
              <span>{opinion.debates} 场辩论</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkline data={opinion.priceHistory} width={64} height={24} />
              <div className="text-right">
                <div className="font-mono font-bold text-base">{opinion.price}</div>
                <div
                  className="font-mono text-xs font-medium"
                  style={{ color: isUp ? "var(--accent-green)" : "var(--accent-red)" }}
                >
                  {isUp ? "+" : ""}{change} ({isUp ? "+" : ""}{changePercent}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
