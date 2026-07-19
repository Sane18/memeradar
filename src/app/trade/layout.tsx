import { TradeTopBar } from "@/components/trade/TradeTopBar";
import { GlobalTicker } from "@/components/trade/GlobalTicker";

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-term-bg font-sans text-term-text">
      <TradeTopBar />
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      <GlobalTicker />
    </div>
  );
}
