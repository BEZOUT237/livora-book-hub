import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/content";
import yemelinkLogo from "@/assets/yemelink-logo.png";
import algoFinanceLogo from "@/assets/algo-finance-logo.jpg";

export function Partners() {
  const { t } = useI18n();
  const { c } = useContent();

  return (
    <section className="border-y border-border bg-secondary/50 py-12">
      <div className="container-livora text-center">
        <p className="eyebrow">{c("home_partners_title", t("partners.title"))}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-10">
          <figure className="flex flex-col items-center gap-2">
            <div className="flex h-32 w-full max-w-xs items-center justify-center overflow-hidden rounded-lg bg-card p-3 shadow-panel">
              <img src={yemelinkLogo} alt="YEMELINK logo" loading="lazy" width="1024" height="1024" className="size-full object-contain" />
            </div>
            <figcaption className="text-xs text-muted-foreground">
              Product &amp; technology — Stéphane Yemeli
            </figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-2">
            <div className="flex h-32 w-full max-w-xs items-center justify-center overflow-hidden rounded-lg bg-card p-3 shadow-panel">
              <img src={algoFinanceLogo} alt="Algo Finance logo" loading="lazy" width="1024" height="1024" className="size-full object-contain" />
            </div>
            <figcaption className="text-xs text-muted-foreground">Finance &amp; supply — Nickel Feumo</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  const { c } = useContent();
  const contactEmail = c("contact_email", "yemelink@gmail.com");
  const contactAddress = c("contact_address", "Bolu, Türkiye");
  const contactPhone = c("contact_phone", "+90 501 024 20 25");
  const footerAbout = c("footer_about", "The smart international bookstore for Türkiye.");

  return (
    <footer className="mt-16 bg-ink pb-20 pt-14 text-ink-foreground md:pb-14">
      <div className="container-livora grid gap-10 md:grid-cols-4">
        <div>
          <span className="font-serif text-2xl tracking-[0.14em]">LIVORA</span>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.3em] text-accent">INTERNATIONAL BOOKS</p>
          <p className="mt-4 max-w-xs text-sm text-ink-foreground/70">{footerAbout}</p>
        </div>
        <div className="text-sm">
          <p className="eyebrow text-ink-foreground/50">{t("nav.books")}</p>
          <ul className="mt-3 space-y-2 text-ink-foreground/75">
            <li><Link to="/books" className="hover:text-accent">{t("catalog.title")}</Link></li>
            <li><Link to="/books" search={{ lang: "EN" } as never} className="hover:text-accent">{t("nav.english")}</Link></li>
            <li><Link to="/books" search={{ lang: "FR" } as never} className="hover:text-accent">{t("nav.french")}</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow text-ink-foreground/50">LIVORA</p>
          <ul className="mt-3 space-y-2 text-ink-foreground/75">
            <li><Link to="/about" className="hover:text-accent">{t("nav.about")}</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/account" className="hover:text-accent">{t("nav.account")}</Link></li>
            <li><Link to="/cart" className="hover:text-accent">{t("nav.cart")}</Link></li>
          </ul>
        </div>
        <div className="text-sm text-ink-foreground/75">
          <p className="eyebrow text-ink-foreground/50">Contact</p>
          <p className="mt-3">{contactAddress}</p>
          <a href={`mailto:${contactEmail}`} className="inline-block pt-1 hover:text-accent">{contactEmail}</a>
          <p className="pt-1">{contactPhone}</p>
          <p className="mt-4 text-xs text-ink-foreground/50">Backed by YEMELINK &amp; Algo Finance</p>
        </div>
      </div>
      <div className="container-livora mt-10 border-t border-ink-foreground/10 pt-6 text-xs text-ink-foreground/50">
        © {new Date().getFullYear()} LIVORA. {c("footer_rights", "All rights reserved.")}
      </div>
    </footer>
  );
}
