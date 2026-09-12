import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/livora/SiteShell";
import { Partners } from "@/components/livora/Footer";
import { useContent } from "@/lib/content";
import nikoPortrait from "@/assets/nickel-feumo.jpg";
import stephPortrait from "@/assets/steph-yemeli.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LIVORA — The Smart International Bookstore for Türkiye" },
      { name: "description", content: "LIVORA is an independent bookstore in Bolu specialised in English and French best-sellers, founded by YEMELINK and Algo Finance." },
      { property: "og:title", content: "About LIVORA" },
      { property: "og:description", content: "An independent, curated English & French bookstore based in Bolu, Türkiye." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { c } = useContent();
  return (
    <SiteShell>
      <div className="container-livora max-w-5xl py-16">
        <div className="max-w-3xl">
          <p className="eyebrow">About</p>
          <h1 className="mt-3 text-4xl">{c("about_title", "The smart international bookstore for Türkiye.")}</h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">{c("about_p1", "LIVORA is an independent bookstore based in Bolu, specialised in new English and French titles — the books people are actually talking about, in stock, priced fairly, and delivered quickly.")}</p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{c("about_p2", "The company is founded by Stéphane Yemeli (product, technology, brand and growth — YEMELINK) and Nickel Feumo (finance, pricing, supply and inventory — Algo Finance).")}</p>
          <Link to="/books" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-ink-foreground">
            Explore the catalogue
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-panel">
            <div className="bg-slate-950 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
              YEMELINK
            </div>
            <div className="p-4">
              <img src={stephPortrait} alt={c("founder_1_name", "Stéphane Yemeli") + " portrait"} className="h-[420px] w-full rounded-xl object-cover" />
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-panel">
            <div className="bg-slate-950 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
              Algo Finance
            </div>
            <div className="p-4">
              <img src={nikoPortrait} alt={c("founder_2_name", "Nickel Feumo") + " portrait"} className="h-[420px] w-full rounded-xl object-cover" />
            </div>
          </div>
        </div>
      </div>
      <Partners />
    </SiteShell>
  );
}
