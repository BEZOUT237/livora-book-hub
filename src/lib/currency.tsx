import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Currency = "TRY" | "USD" | "EUR";

/** Fallback conversion rates from TRY, overridden by the `fx_rate_usd` / `fx_rate_eur` settings. */
const FALLBACK_RATES: Record<Currency, number> = { TRY: 1, USD: 0.0208, EUR: 0.018 };
const LOCALES: Record<Currency, string> = { TRY: "tr-TR", USD: "en-US", EUR: "de-DE" };
const STORAGE_KEY = "livora.currency";

export const CURRENCIES: Currency[] = ["TRY", "USD", "EUR"];

/** A price expressed in TRY plus optional exact USD / EUR prices set by the admin. */
export type PriceSet = { try: number; usd?: number | null | undefined; eur?: number | null | undefined };

export function formatCurrency(value: number | string | null | undefined, currency: Currency): string {
  return new Intl.NumberFormat(LOCALES[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: Record<Currency, number>;
  /** Convert a TRY amount into the active currency. */
  convert: (tryAmount: number | string | null | undefined) => number;
  /** Format a TRY amount in the active currency. */
  format: (tryAmount: number | string | null | undefined) => string;
  /** Resolve a price set to a number in the active currency, preferring exact prices. */
  amount: (price: PriceSet) => number;
  /** Format a price set in the active currency, preferring exact prices. */
  price: (price: PriceSet) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("TRY");
  const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK_RATES);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "TRY" || stored === "USD" || stored === "EUR") setCurrencyState(stored);
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const { data } = await supabase.from("settings").select("key,value").in("key", ["fx_rate_usd", "fx_rate_eur"]);
      if (!alive || !data) return;
      const map = Object.fromEntries(data.map((row) => [row.key, Number(row.value)]));
      setRates({
        TRY: 1,
        USD: Number.isFinite(map["fx_rate_usd"]) && map["fx_rate_usd"] ? map["fx_rate_usd"]! : FALLBACK_RATES.USD,
        EUR: Number.isFinite(map["fx_rate_eur"]) && map["fx_rate_eur"] ? map["fx_rate_eur"]! : FALLBACK_RATES.EUR,
      });
    })();
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const convert = (tryAmount: number | string | null | undefined) => Number(tryAmount || 0) * rates[currency];
    const amount = (p: PriceSet) => {
      const base = Number(p.try || 0);
      if (currency === "USD" && p.usd != null && Number(p.usd) > 0) return Number(p.usd);
      if (currency === "EUR" && p.eur != null && Number(p.eur) > 0) return Number(p.eur);
      return base * rates[currency];
    };
    return {
      currency,
      rates,
      setCurrency: (next) => {
        setCurrencyState(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      },
      convert,
      format: (tryAmount) => formatCurrency(convert(tryAmount), currency),
      amount,
      price: (p) => formatCurrency(amount(p), currency),
    };
  }, [currency, rates]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used inside CurrencyProvider");
  return context;
}
