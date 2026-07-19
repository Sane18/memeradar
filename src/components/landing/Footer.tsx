import Link from "next/link";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-chad-border bg-chad-bg">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo} alt={brand.name} className="h-9 w-9 object-contain" />
            <span className="text-lg font-extrabold tracking-tight text-white">
              Meme<span className="text-chad-primary">Radar</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-chad-muted">
            {brand.tagline} Trade any Solana token from web or mobile.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-chad-muted">PRODUCT</p>
          <ul className="mt-4 space-y-2 text-sm text-chad-muted">
            <li><Link href="/trade" className="hover:text-white">Trade</Link></li>
            <li><a href={brand.appStore.ios} className="hover:text-white">iOS app</a></li>
            <li><a href={brand.appStore.android} className="hover:text-white">Android app</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-chad-muted">SOCIAL</p>
          <ul className="mt-4 space-y-2 text-sm text-chad-muted">
            <li><a href={brand.social.twitter} className="hover:text-white">X / Twitter</a></li>
            <li><a href={brand.social.site} className="hover:text-white">Website</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-chad-muted">LEGAL</p>
          <ul className="mt-4 space-y-2 text-sm text-chad-muted">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-chad-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-chad-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {brand.name}. Not financial advice.</p>
          <p>Built on Solana · Routing by Jupiter · Data by BirdEye</p>
        </div>
      </div>
    </footer>
  );
}
