"use client";

import { useEffect, useState } from "react";

type PageCurlCornerProps = {
  progress: number;
  monthLabel: string;
};

export function PageCurlCorner({ progress, monthLabel }: PageCurlCornerProps) {
  const minCurlSize = 20;
  const maxCurlSize = 80;
  const targetSize = minCurlSize + progress * (maxCurlSize - minCurlSize);
  const [animatedSize, setAnimatedSize] = useState(0);

  useEffect(() => {
    setAnimatedSize(0);
    const timer = window.setTimeout(() => {
      setAnimatedSize(targetSize);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [targetSize]);

  const progressPercent = Math.round(progress * 100);
  const dayOfMonth = new Date().getDate();

  return (
    <div
      className="group absolute bottom-0 right-0 z-20"
      style={{
        width: animatedSize,
        height: animatedSize,
        transition: "width 0.8s ease-out, height 0.8s ease-out",
      }}
    >
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "100% 0 0 0",
          background: "linear-gradient(135deg, #e0e0e0, #f5f5f5)",
          boxShadow: "-2px -2px 6px rgba(0,0,0,0.15)",
        }}
      />

      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: "120%",
          height: "120%",
          borderRadius: "100% 0 0 0",
          background: "radial-gradient(ellipse at bottom right, rgba(0,0,0,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="absolute bottom-full right-1 opacity-0 group-hover:opacity-100 transition-all duration-150 ease-in-out pointer-events-none">
        <div className="mb-2 px-2 py-1 rounded-md text-xs text-gray-600 bg-white border border-gray-200 shadow-sm whitespace-nowrap">
          {dayOfMonth} days into {monthLabel} ({progressPercent}%)
        </div>
      </div>
    </div>
  );
}
