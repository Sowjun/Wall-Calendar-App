"use client";

export function SpiralBinding() {
  return (
    <div className="h-8 px-4 md:px-6 flex items-end justify-center gap-1.5 border-b border-gray-300/70 bg-white">
      {Array.from({ length: 30 }).map((_, index) => (
        <div key={`ring-${index}`} className="relative w-2.5 h-4">
          <span className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-1.5 bg-gray-400 rounded-sm shadow-sm" />
          <span className="absolute left-1/2 top-1 -translate-x-1/2 w-1.5 h-2.5 border-[1.5px] border-gray-600/80 rounded-b-sm rounded-t-[2px]" />
        </div>
      ))}
    </div>
  );
}
