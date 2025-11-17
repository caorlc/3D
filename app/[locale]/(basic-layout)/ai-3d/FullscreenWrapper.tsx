"use client";

export default function FullscreenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keep header and footer visible, just adjust layout
  return (
    <div className="w-full min-h-screen bg-[#0f1419] flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">{children}</div>
    </div>
  );
}

