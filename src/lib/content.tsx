import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export type SiteContentRow = {
  key: string;
  group_name: string;
  label: string;
  kind: string;
  value_tr: string;
  value_en: string;
  value_fr: string;
  sort_order: number;
};

export async function fetchSiteContentRows(): Promise<SiteContentRow[]> {
  const { data, error } = await supabase
    .from("site_content")
    .select("key,group_name,label,kind,value_tr,value_en,value_fr,sort_order")
    .order("group_name")
    .order("sort_order");
  if (error) return [];
  return (data ?? []) as SiteContentRow[];
}

/**
 * Every public text block goes through this hook, so the admin Content CMS can
 * change any wording on the site without a code change.
 */
export function useContent() {
  const { locale } = useI18n();
  const { data } = useQuery({ queryKey: ["site-content-rows"], queryFn: fetchSiteContentRows, staleTime: 60_000 });

  const c = (key: string, fallback = "") => {
    const row = (data ?? []).find((r) => r.key === key);
    if (!row) return fallback;
    const value = locale === "tr" ? row.value_tr : locale === "fr" ? row.value_fr : row.value_en;
    return value?.trim() ? value : fallback;
  };

  return { c, rows: data ?? [] };
}
