"use client";

import { useEffect, useRef, useState } from "react";

const TFS = ["1m", "5m", "15m", "1H", "4H", "1D", "1W"];

type ChartType = "candles" | "hollow" | "bars" | "line" | "area" | "baseline" | "columns";

const CHART_TYPES: { key: ChartType; label: string }[] = [
  { key: "candles",  label: "Candles" },
  { key: "hollow",   label: "Hollow candles" },
  { key: "bars",     label: "Bars" },
  { key: "line",     label: "Line" },
  { key: "area",     label: "Area" },
  { key: "baseline", label: "Baseline" },
  { key: "columns",  label: "Columns" },
];

function ChartTypeIcon({ type, className = "h-3.5 w-3.5" }: { type: ChartType; className?: string }) {
  switch (type) {
    case "candles":
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
          <line x1="3" y1="1" x2="3" y2="15" />
          <rect x="1.5" y="4" width="3" height="5" fill="currentColor" stroke="none" />
          <line x1="8" y1="3" x2="8" y2="15" />
          <rect x="6.5" y="7" width="3" height="5" fill="currentColor" stroke="none" />
          <line x1="13" y1="2" x2="13" y2="13" />
          <rect x="11.5" y="3" width="3" height="5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "hollow":
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
          <line x1="3" y1="1" x2="3" y2="15" />
          <rect x="1.5" y="4" width="3" height="5" />
          <line x1="8" y1="3" x2="8" y2="15" />
          <rect x="6.5" y="7" width="3" height="5" />
          <line x1="13" y1="2" x2="13" y2="13" />
          <rect x="11.5" y="3" width="3" height="5" />
        </svg>
      );
    case "bars":
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
          <line x1="3" y1="3" x2="3" y2="13" />
          <line x1="1" y1="6" x2="3" y2="6" />
          <line x1="3" y1="10" x2="5" y2="10" />
          <line x1="8" y1="2" x2="8" y2="14" />
          <line x1="6" y1="5" x2="8" y2="5" />
          <line x1="8" y1="11" x2="10" y2="11" />
          <line x1="13" y1="4" x2="13" y2="12" />
          <line x1="11" y1="7" x2="13" y2="7" />
          <line x1="13" y1="10" x2="15" y2="10" />
        </svg>
      );
    case "line":
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <polyline points="1,13 5,7 9,10 13,4 15,6" />
        </svg>
      );
    case "area":
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none">
          <polyline points="1,12 5,6 9,9 13,3 15,5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M1,12 L5,6 L9,9 L13,3 L15,5 L15,15 L1,15 Z" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case "baseline":
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none">
          <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,1" opacity="0.4" />
          <polyline points="1,8 5,4 9,6 13,2 15,4" stroke="#16C784" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M1,8 L5,4 L9,6 L13,2 L15,4 L15,8 L1,8 Z" fill="#16C784" opacity="0.2" />
          <polyline points="1,8 4,11 8,13 12,10 15,12" stroke="#F6465D" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M1,8 L4,11 L8,13 L12,10 L15,12 L15,8 L1,8 Z" fill="#F6465D" opacity="0.2" />
        </svg>
      );
    case "columns":
      return (
        <svg viewBox="0 0 16 16" className={className} fill="currentColor">
          <rect x="1" y="7" width="3" height="8" />
          <rect x="5" y="4" width="3" height="11" />
          <rect x="9" y="9" width="3" height="6" />
          <rect x="13" y="2" width="3" height="13" />
        </svg>
      );
  }
}

function fmt(v: number, mcap: boolean) {
  if (mcap) {
    return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(v);
  }
  return v < 1 ? v.toPrecision(4) : v.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

export function PriceChart({ mint }: { mint: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const typePickerRef = useRef<HTMLDivElement>(null);
  const [tf, setTf] = useState("15m");
  const [unit, setUnit] = useState<"price" | "mcap">("price");
  const [chartType, setChartType] = useState<ChartType>("candles");
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [source, setSource] = useState("");
  const [ohlc, setOhlc] = useState<{ o: number; h: number; l: number; c: number } | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showTypePicker) return;
    function onOutside(e: MouseEvent) {
      if (typePickerRef.current && !typePickerRef.current.contains(e.target as Node)) {
        setShowTypePicker(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [showTypePicker]);

  useEffect(() => {
    let chart: any;
    let disposed = false;

    async function run() {
      if (!ref.current) return;
      const [chartRes, tokRes] = await Promise.all([
        fetch(`/api/chart/${mint}?type=${tf}`).then((r) => r.json()),
        fetch(`/api/token/${mint}`).then((r) => r.json()).catch(() => null),
      ]);
      if (disposed || !ref.current) return;

      const kind: string = chartRes.kind || "candle";
      const points: any[] = (chartRes.points || []).slice().sort((a: any, b: any) => a.time - b.time);
      setSource(chartRes.source);
      const tok = tokRes?.token;
      const factor = unit === "mcap" && tok?.marketCap && tok?.price ? tok.marketCap / tok.price : 1;

      const { createChart, ColorType, LineStyle } = await import("lightweight-charts");
      ref.current.innerHTML = "";
      chart = createChart(ref.current, {
        autoSize: true,
        layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#5C5C5C", fontFamily: "Inter, sans-serif" },
        grid: { vertLines: { visible: false }, horzLines: { color: "#1E1E1E", style: LineStyle.Dashed } },
        rightPriceScale: { borderColor: "#1E1E1E" },
        timeScale: { borderColor: "#1E1E1E", timeVisible: true },
        crosshair: {
          mode: 1,
          vertLine: { color: "#8A8A8A", style: LineStyle.Dashed, labelBackgroundColor: "#1E1E1E" },
          horzLine: { color: "#8A8A8A", style: LineStyle.Dashed, labelBackgroundColor: "#1E1E1E" },
        },
      });

      const needsOHLC = chartType === "candles" || chartType === "hollow" || chartType === "bars";
      const hasOHLC = kind === "candle";

      if (needsOHLC && hasOHLC) {
        const ohlcData = points.map((c) => ({
          time: c.time,
          open: c.open * factor,
          high: c.high * factor,
          low: c.low * factor,
          close: c.close * factor,
        }));

        if (chartType === "candles") {
          const s = chart.addCandlestickSeries({
            upColor: "#16C784", downColor: "#F6465D",
            borderVisible: false,
            wickUpColor: "#16C784", wickDownColor: "#F6465D",
            priceLineColor: "#3B82F6",
          });
          s.setData(ohlcData);
        } else if (chartType === "hollow") {
          const s = chart.addCandlestickSeries({
            upColor: "transparent", downColor: "transparent",
            borderVisible: true,
            borderUpColor: "#16C784", borderDownColor: "#F6465D",
            wickUpColor: "#16C784", wickDownColor: "#F6465D",
            priceLineColor: "#3B82F6",
          });
          s.setData(ohlcData);
        } else if (chartType === "bars") {
          const s = chart.addBarSeries({
            upColor: "#16C784", downColor: "#F6465D",
            priceLineColor: "#3B82F6",
          });
          s.setData(ohlcData);
        }

        // Volume overlay for OHLC types
        const vol = chart.addHistogramSeries({ priceScaleId: "vol", priceFormat: { type: "volume" } });
        vol.setData(points.map((c) => ({
          time: c.time,
          value: c.volume || 0,
          color: c.close >= c.open ? "rgba(22,199,132,0.4)" : "rgba(246,70,93,0.4)",
        })));
        chart.priceScale("vol").applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });

        const last = points[points.length - 1];
        if (last) setOhlc({ o: last.open * factor, h: last.high * factor, l: last.low * factor, c: last.close * factor });
      } else {
        // Line-based types (or OHLC type fallback when only line data available)
        const lineData = hasOHLC
          ? points.map((c) => ({ time: c.time, value: c.close * factor }))
          : points.map((p) => ({ time: p.time, value: p.value * factor }));

        setOhlc(null);

        if (chartType === "line") {
          const s = chart.addLineSeries({
            color: "#3B82F6", lineWidth: 2, priceLineColor: "#3B82F6",
          });
          s.setData(lineData);
        } else if (chartType === "baseline") {
          const avg = lineData.reduce((s, p) => s + p.value, 0) / (lineData.length || 1);
          const s = chart.addBaselineSeries({
            baseValue: { type: "price", price: avg },
            topLineColor: "#16C784",
            topFillColor1: "rgba(22,199,132,0.25)",
            topFillColor2: "rgba(22,199,132,0.0)",
            bottomLineColor: "#F6465D",
            bottomFillColor1: "rgba(246,70,93,0.0)",
            bottomFillColor2: "rgba(246,70,93,0.25)",
            priceLineColor: "#3B82F6",
          });
          s.setData(lineData);
        } else if (chartType === "columns") {
          const s = chart.addHistogramSeries({ color: "#3B82F6", priceLineColor: "#3B82F6" });
          s.setData(lineData);
        } else {
          // area — default for "area" and fallback when OHLC chart type has no OHLC data
          const s = chart.addAreaSeries({
            lineColor: "#3B82F6",
            topColor: "rgba(59,130,246,0.25)",
            bottomColor: "rgba(59,130,246,0.02)",
            lineWidth: 2,
            priceLineColor: "#3B82F6",
          });
          s.setData(lineData);
        }
      }

      chart.timeScale().fitContent();
    }

    run();
    return () => {
      disposed = true;
      if (chart) chart.remove();
    };
  }, [mint, tf, unit, chartType]);

  const mcap = unit === "mcap";

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-9 items-center justify-between border-b border-term-border px-3">
        <div className="flex items-center gap-1">
          {TFS.map((t) => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={`rounded border px-1.5 py-0.5 text-[11px] transition ${
                tf === t
                  ? "border-term-text3 bg-term-surface text-term-text"
                  : "border-transparent text-term-text3 hover:border-term-border hover:text-term-text2"
              }`}
            >
              {t}
            </button>
          ))}

          <span className="mx-1.5 h-4 w-px bg-term-border" />

          {/* Chart type picker */}
          <div ref={typePickerRef} className="relative">
            <button
              onClick={() => setShowTypePicker((v) => !v)}
              title="Chart type"
              className={`grid h-6 w-6 place-items-center rounded border transition ${
                showTypePicker
                  ? "border-term-accent bg-term-surface text-term-text"
                  : "border-term-border text-term-text3 hover:border-term-text3 hover:text-term-text2"
              }`}
            >
              <ChartTypeIcon type={chartType} />
            </button>

            {showTypePicker && (
              <div className="absolute left-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-term-border bg-term-bg2 py-1 shadow-xl">
                {CHART_TYPES.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => { setChartType(key); setShowTypePicker(false); }}
                    className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-[12px] transition hover:bg-term-surface ${
                      chartType === key ? "text-term-text" : "text-term-text2"
                    }`}
                  >
                    <ChartTypeIcon type={key} className="h-3.5 w-3.5 shrink-0" />
                    {label}
                    {chartType === key && (
                      <svg viewBox="0 0 16 16" className="ml-auto h-3 w-3 text-term-accent" fill="currentColor">
                        <path d="M13.5 3.5L6 11 2.5 7.5l-1 1L6 13l8.5-8.5z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="mx-1.5 h-4 w-px bg-term-border" />

          <div className="flex overflow-hidden rounded-lg border border-term-border">
            {(["price", "mcap"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-2.5 py-0.5 text-[11px] transition ${
                  unit === u ? "bg-term-surface text-term-text" : "text-term-text3 hover:text-term-text2"
                }`}
              >
                {u === "price" ? "Price" : "MCap"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          {ohlc && (
            <span className="hidden gap-2 text-term-text3 sm:flex">
              <span>O <span className="text-term-text">{fmt(ohlc.o, mcap)}</span></span>
              <span>H <span className="text-term-up">{fmt(ohlc.h, mcap)}</span></span>
              <span>L <span className="text-term-down">{fmt(ohlc.l, mcap)}</span></span>
              <span>C <span className="text-term-text">{fmt(ohlc.c, mcap)}</span></span>
            </span>
          )}
          <span className="text-term-text3">{source === "birdeye" ? "● live" : "○ demo"}</span>
        </div>
      </div>
      <div ref={ref} className="min-h-0 flex-1" />
    </div>
  );
}
