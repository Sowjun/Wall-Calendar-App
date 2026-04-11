"use client";

import type { MonthTheme } from "./constants";

type Tab = "calendar" | "notes";

export type MobileTabBarProps = {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
  theme: MonthTheme;
  isDark: boolean;
};

export function MobileTabBar({ activeTab, onChange, theme, isDark }: MobileTabBarProps) {
  const activeStyle = {
    background: `linear-gradient(135deg, ${theme.accentColor} 0%, ${theme.primaryColor} 80%)`,
    boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
  } as const;

  return (
    <div className={`lg:hidden rounded-full p-1 shadow-sm ${isDark ? "bg-slate-800" : "bg-white"}`}>
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => onChange("calendar")}
          className={`w-full min-h-[44px] rounded-full text-sm font-semibold transition-colors ${
            activeTab === "calendar" ? "text-white" : isDark ? "bg-transparent text-slate-300" : "bg-transparent text-gray-500"
          }`}
          style={activeTab === "calendar" ? activeStyle : undefined}
        >
          Calendar
        </button>
        <button
          type="button"
          onClick={() => onChange("notes")}
          className={`w-full min-h-[44px] rounded-full text-sm font-semibold transition-colors ${
            activeTab === "notes" ? "text-white" : isDark ? "bg-transparent text-slate-300" : "bg-transparent text-gray-500"
          }`}
          style={activeTab === "notes" ? activeStyle : undefined}
        >
          Notes
        </button>
      </div>
    </div>
  );
}
