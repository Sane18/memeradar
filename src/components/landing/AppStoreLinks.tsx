"use client";

import { brand } from "@/lib/brand";

function AppleBadge() {
  return (
    <a
      href={brand.appStore.ios}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-lg border border-white/20 bg-black px-3 py-1.5 transition hover:bg-[#111]"
    >
      <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
        <path d="M16.36 12.78c.02 2.36 2.07 3.14 2.1 3.16-.02.05-.33 1.13-1.1 2.24-.66.96-1.35 1.91-2.44 1.93-1.06.02-1.41-.63-2.63-.63-1.22 0-1.6.61-2.61.65-1.05.04-1.85-1.04-2.52-1.99-1.36-1.97-2.4-5.56-1-7.99.69-1.2 1.92-1.97 3.27-1.99 1.03-.02 2 .69 2.63.69.63 0 1.81-.86 3.05-.73.52.02 1.98.21 2.92 1.58-.08.05-1.74 1.02-1.72 3.07M14.38 5.6c.56-.68.94-1.62.84-2.56-.81.03-1.79.54-2.37 1.21-.52.6-.98 1.56-.86 2.48.9.07 1.83-.46 2.39-1.13" />
      </svg>
      <span className="text-left leading-none text-white">
        <span className="block text-[9px] tracking-wide text-white/80">Download on the</span>
        <span className="text-[15px] font-semibold leading-tight">App Store</span>
      </span>
    </a>
  );
}

function GooglePlayBadge() {
  return (
    <a
      href={brand.appStore.android}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-lg border border-white/20 bg-black px-3 py-1.5 transition hover:bg-[#111]"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        {/* upper (blue) + lower (green) halves, red/yellow tip */}
        <path d="M4 2.5 L4 12 L19 12 Z" fill="#00D2FF" />
        <path d="M4 12 L4 21.5 L19 12 Z" fill="#00C853" />
        <path d="M13 9 L19 12 L13 12 Z" fill="#FF3D45" />
        <path d="M13 12 L19 12 L13 15 Z" fill="#FFCE00" />
      </svg>
      <span className="text-left leading-none text-white">
        <span className="block text-[9px] tracking-wide text-white/80">GET IT ON</span>
        <span className="text-[15px] font-semibold leading-tight">Google Play</span>
      </span>
    </a>
  );
}

export function AppStoreLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <AppleBadge />
      <GooglePlayBadge />
    </div>
  );
}
