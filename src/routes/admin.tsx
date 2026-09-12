import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  Boxes,
  CreditCard,
  LayoutDashboard,
  LibraryBig,
  ListOrdered,
  Package,
  PackageSearch,
  Palette,
  ReceiptText,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CrudSection } from "@/components/admin/CrudSection";
import { formatTRY, landedCost, marginPct } from "@/lib/format";
import { formatCurrency, type Currency } from "@/lib/currency";
import { toast } from "sonner";
import { useRoles, useSession } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import { deleteAdminUser } from "@/lib/admin-users.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Control Center | LIVORA" },
      { name: "description", content: "LIVORA control center for books, orders, inventory, content and commerce operations." },
      { property: "og:title", content: "LIVORA Admin" },
      { property: "og:description", content: "Internal operations dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type ModuleKey =
  | "dashboard"
  | "books"
  | "orders"
  | "payments"
  | "customers"
  | "inventory"
  | "suppliers"
  | "content"
  | "homepage"
  | "categories"
  | "collections"
  | "media"
  | "marketing"
  | "promotions"
  | "shipping"
  | "reviews"
  | "analytics"
  | "settings"
  | "admins"
  | "activity";

const moduleMeta: Array<{ key: ModuleKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "books", label: "Books", icon: LibraryBig },
  { key: "orders", label: "Orders", icon: ListOrdered },
  { key: "payments", label: "Payments / Dekont", icon: CreditCard },
  { key: "customers", label: "Customers", icon: Users },
  { key: "inventory", label: "Inventory", icon: Package },
  { key: "suppliers", label: "Suppliers", icon: Truck },
  { key: "content", label: "Content CMS", icon: ReceiptText },
  { key: "homepage", label: "Homepage", icon: Palette },
  { key: "categories", label: "Categories", icon: Sparkles },
  { key: "collections", label: "Collections", icon: Wand2 },
  { key: "media", label: "Media Library", icon: PackageSearch },
  { key: "marketing", label: "Marketing", icon: Activity },
  { key: "promotions", label: "Promotions", icon: ShoppingCart },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "reviews", label: "Reviews", icon: ShieldCheck },
  { key: "analytics", label: "Analytics", icon: Activity },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "admins", label: "Admin Users", icon: Users },
  { key: "activity", label: "Activity Log", icon: Activity },
];

const BOOK_FIELDS = [
  { name: "title", label: "Title", type: "text" as const, required: true },
  { name: "slug", label: "Slug", type: "text" as const, required: true },
  { name: "isbn", label: "ISBN", type: "text" as const, inTable: false },
  { name: "book_language", label: "Language", type: "select" as const, options: [{ value: "EN", label: "EN" }, { value: "FR", label: "FR" }, { value: "TR", label: "TR" }] },
  { name: "format", label: "Format", type: "select" as const, options: [{ value: "paperback", label: "Paperback" }, { value: "hardcover", label: "Hardcover" }], inTable: false },
  { name: "price", label: "Price (TRY)", type: "number" as const, default: 0 },
  { name: "price_usd", label: "Price (USD)", type: "number" as const, inTable: false },
  { name: "price_eur", label: "Price (EUR)", type: "number" as const, inTable: false },
  { name: "compare_at_price", label: "Compare at (TRY)", type: "number" as const, inTable: false },
  { name: "purchase_cost", label: "Purchase cost", type: "number" as const, inTable: false },
  { name: "stock_qty", label: "Stock", type: "number" as const, default: 0 },
  { name: "reorder_threshold", label: "Reorder at", type: "number" as const, default: 3, inTable: false },
  { name: "is_active", label: "Active", type: "boolean" as const, default: true },
  { name: "is_featured", label: "Featured", type: "boolean" as const, default: false, inTable: false },
  { name: "is_bestseller", label: "Bestseller", type: "boolean" as const, default: false, inTable: false },
  { name: "is_new_arrival", label: "New arrival", type: "boolean" as const, default: false, inTable: false },
  { name: "is_trending", label: "Trending", type: "boolean" as const, default: false, inTable: false },
  { name: "cover_url", label: "Cover", type: "image" as const, inTable: false },
  { name: "cover_alt", label: "Cover alt text", type: "text" as const, inTable: false },
  { name: "short_description", label: "Short description", type: "textarea" as const, inTable: false },
  { name: "description", label: "Description", type: "textarea" as const, inTable: false },
  { name: "why_you_like_it", label: "Why you'll like it", type: "textarea" as const, inTable: false },
  { name: "seo_title", label: "SEO title", type: "text" as const, inTable: false },
  { name: "seo_description", label: "SEO description", type: "textarea" as const, inTable: false },
  { name: "tags", label: "Tags", type: "text" as const, inTable: false },
];

const SITE_CONTENT_FIELDS = [
  { name: "key", label: "Key", type: "text" as const, required: true },
  { name: "label", label: "Label", type: "text" as const, required: true },
  { name: "group_name", label: "Group", type: "text" as const, required: true },
  { name: "kind", label: "Kind", type: "select" as const, options: [{ value: "text", label: "Short text" }, { value: "richtext", label: "Paragraph" }], inTable: false },
  { name: "value_tr", label: "Türkçe", type: "textarea" as const, inTable: false },
  { name: "value_en", label: "English", type: "textarea" as const },
  { name: "value_fr", label: "Français", type: "textarea" as const, inTable: false },
  { name: "sort_order", label: "Sort order", type: "number" as const, default: 0, inTable: false },
];

const MEDIA_FIELDS = [
  { name: "url", label: "File", type: "image" as const, required: true },
  { name: "file_name", label: "File name", type: "text" as const, required: true },
  { name: "alt_text", label: "Alt text", type: "text" as const },
  { name: "folder", label: "Folder", type: "text" as const, default: "general" },
];

const ROLE_FIELDS = [
  { name: "user_id", label: "User ID", type: "text" as const, required: true, help: "Copy the user id from the Customers module." },
  {
    name: "role",
    label: "Role",
    type: "select" as const,
    required: true,
    options: [
      { value: "super_admin", label: "Super admin" },
      { value: "tech", label: "Tech" },
      { value: "finance", label: "Finance" },
      { value: "inventory", label: "Inventory" },
      { value: "support", label: "Support" },
      { value: "marketing", label: "Marketing" },
      { value: "customer", label: "Customer" },
    ],
  },
];

const CATEGORY_FIELDS = [
  { name: "slug", label: "Slug", type: "text" as const, required: true },
  { name: "name_tr", label: "Name (TR)", type: "text" as const, required: true },
  { name: "name_en", label: "Name (EN)", type: "text" as const, required: true },
  { name: "name_fr", label: "Name (FR)", type: "text" as const, required: true },
  { name: "sort_order", label: "Sort order", type: "number" as const, default: 0 },
];

const COLLECTION_FIELDS = [
  { name: "slug", label: "Slug", type: "text" as const, required: true },
  { name: "title_tr", label: "Title (TR)", type: "text" as const, required: true },
  { name: "title_en", label: "Title (EN)", type: "text" as const, required: true },
  { name: "title_fr", label: "Title (FR)", type: "text" as const, required: true },
  { name: "is_active", label: "Active", type: "boolean" as const, default: true },
  { name: "sort_order", label: "Sort order", type: "number" as const, default: 0 },
];

const SUPPLIER_FIELDS = [
  { name: "name", label: "Supplier", type: "text" as const, required: true },
  { name: "contact_name", label: "Contact", type: "text" as const },
  { name: "email", label: "Email", type: "text" as const },
  { name: "phone", label: "Phone", type: "text" as const },
  { name: "currency", label: "Currency", type: "select" as const, options: [{ value: "TRY", label: "TRY" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }] },
  { name: "is_active", label: "Active", type: "boolean" as const, default: true },
];

const SETTINGS_FIELDS = [
  { name: "category", label: "Category", type: "text" as const, required: true },
  { name: "key", label: "Key", type: "text" as const, required: true },
  { name: "label", label: "Label", type: "text" as const, required: true },
  { name: "value", label: "Value", type: "text" as const, required: true },
];

const HOMEPAGE_FIELDS = [
  { name: "key", label: "Key", type: "text" as const, required: true },
  { name: "title_tr", label: "Title (TR)", type: "text" as const },
  { name: "title_en", label: "Title (EN)", type: "text" as const },
  { name: "title_fr", label: "Title (FR)", type: "text" as const },
  { name: "is_enabled", label: "Enabled", type: "boolean" as const, default: true },
  { name: "sort_order", label: "Sort order", type: "number" as const, default: 0 },
];

const PROMOTION_FIELDS = [
  { name: "code", label: "Code", type: "text" as const, required: true },
  { name: "description", label: "Description", type: "textarea" as const },
  { name: "discount_type", label: "Type", type: "select" as const, options: [{ value: "percent", label: "Percent" }, { value: "fixed", label: "Fixed" }] },
  { name: "discount_value", label: "Value", type: "number" as const, default: 0 },
  { name: "is_active", label: "Active", type: "boolean" as const, default: true },
  { name: "min_cart_total", label: "Minimum cart", type: "number" as const, default: 0 },
];

const REVIEW_FIELDS = [
  { name: "book_id", label: "Book ID", type: "text" as const, required: true },
  { name: "rating", label: "Rating", type: "number" as const, default: 5 },
  { name: "title", label: "Title", type: "text" as const },
  { name: "comment", label: "Comment", type: "textarea" as const },
  { name: "is_approved", label: "Approved", type: "boolean" as const, default: true },
];

const ORDER_FIELDS = [
  { name: "order_number", label: "Order", type: "text" as const, inTable: true },
  { name: "full_name", label: "Customer", type: "text" as const, required: true },
  { name: "email", label: "Email", type: "text" as const, required: true },
  { name: "status", label: "Status", type: "select" as const, options: [{ value: "pending_payment", label: "Pending payment" }, { value: "paid", label: "Paid" }, { value: "shipped", label: "Shipped" }, { value: "completed", label: "Completed" }, { value: "cancelled", label: "Cancelled" }] },
  { name: "payment_status", label: "Payment", type: "select" as const, options: [{ value: "pending", label: "Pending" }, { value: "pending_verification", label: "Verification" }, { value: "paid", label: "Paid" }] },
  { name: "total", label: "Total", type: "number" as const, default: 0 },
  { name: "shipping_carrier", label: "Carrier", type: "text" as const },
  { name: "tracking_number", label: "Tracking", type: "text" as const },
];

const INVENTORY_FIELDS = [
  { name: "book_id", label: "Book ID", type: "text" as const, required: true },
  { name: "delta", label: "Quantity change", type: "number" as const, required: true },
  { name: "reason", label: "Reason", type: "text" as const, required: true },
  { name: "reference", label: "Reference", type: "text" as const },
];

const BLOG_FIELDS = [
  { name: "slug", label: "Slug", type: "text" as const, required: true },
  { name: "title", label: "Title", type: "text" as const, required: true },
  { name: "excerpt", label: "Excerpt", type: "textarea" as const },
  { name: "body", label: "Body", type: "textarea" as const },
  { name: "cover_url", label: "Cover", type: "image" as const },
  { name: "is_published", label: "Published", type: "boolean" as const, default: false },
];

const AMBASSADOR_FIELDS = [
  { name: "name", label: "Name", type: "text" as const, required: true },
  { name: "email", label: "Email", type: "text" as const },
  { name: "code", label: "Code", type: "text" as const, required: true },
  { name: "commission_pct", label: "Commission %", type: "number" as const, default: 5 },
  { name: "is_active", label: "Active", type: "boolean" as const, default: true },
];

const PURCHASE_ORDER_FIELDS = [
  { name: "po_number", label: "PO number", type: "text" as const },
  { name: "supplier_id", label: "Supplier ID", type: "text" as const },
  { name: "status", label: "Status", type: "text" as const, default: "draft" },
  { name: "currency", label: "Currency", type: "select" as const, options: [{ value: "TRY", label: "TRY" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }] },
  { name: "expected_at", label: "Expected", type: "date" as const },
  { name: "total_cost", label: "Total cost", type: "number" as const, default: 0 },
  { name: "notes", label: "Notes", type: "textarea" as const },
];

const CUSTOMER_FIELDS = [
  { name: "email", label: "Email", type: "text" as const },
  { name: "full_name", label: "Name", type: "text" as const },
  { name: "phone", label: "Phone", type: "text" as const },
  { name: "locale", label: "Locale", type: "select" as const, options: [{ value: "tr", label: "TR" }, { value: "en", label: "EN" }, { value: "fr", label: "FR" }] },
  { name: "newsletter_opt_in", label: "Newsletter", type: "boolean" as const, default: false },
];

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: import("react").ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-panel">
      <div className="flex items-center justify-between">
        <p className="eyebrow">{label}</p>
        <Icon className="size-4 text-accent" />
      </div>
      <p className="mt-3 font-serif text-2xl">{value}</p>
    </div>
  );
}

function ModuleSummaryCard({ title, subtitle, badge }: { title: string; subtitle: string; badge: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          {badge}
        </span>
      </div>
    </div>
  );
}

function DashboardPanel() {
  const { data: books } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id,title,slug,isbn,price,stock_qty,reorder_threshold,purchase_cost,purchase_fx_rate,purchase_currency,shipping_cost,customs_cost,packaging_cost,units_sold,book_language,stock_state")
        .order("units_sold", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as Array<Record<string, unknown>>;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,order_number,status,total,created_at,full_name")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [payments, orderCount, customers, reviews] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact", head: true }).in("payment_status", ["pending", "pending_verification"]),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_approved", false),
      ]);
      return {
        payments: payments.count ?? 0,
        orders: orderCount.count ?? 0,
        customers: customers.count ?? 0,
        pendingReviews: reviews.count ?? 0,
      };
    },
  });

  const list = (books ?? []) as Array<Record<string, unknown>>;
  const inventoryValue = list.reduce((sum, book) => {
    const purchaseCost = Number(book["purchase_cost"] ?? 0);
    const fxRate = Number(book["purchase_fx_rate"] ?? 1);
    const shippingCost = Number(book["shipping_cost"] ?? 0);
    const customsCost = Number(book["customs_cost"] ?? 0);
    const packagingCost = Number(book["packaging_cost"] ?? 0);
    return sum + (purchaseCost * fxRate + shippingCost + customsCost + packagingCost) * Number(book["stock_qty"] ?? 0);
  }, 0);
  const lowStock = list.filter((book) => Number(book["stock_qty"] ?? 0) <= Number(book["reorder_threshold"] ?? 0));
  const revenue = (orders ?? []).reduce((sum, order) => sum + Number(order.total ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Revenue" value={formatTRY(revenue)} icon={TrendingUpIcon} />
        <Stat label="Inventory value" value={formatTRY(inventoryValue)} icon={Boxes} />
        <Stat label="SKUs" value={String(list.length)} icon={PackageSearch} />
        <Stat label="Low stock" value={String(lowStock.length)} icon={AlertTriangle} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl">Catalogue margin snapshot</h2>
            <Link to="/books" className="text-sm text-accent hover:underline">Open catalogue</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Landed</th>
                  <th className="p-2">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.slice(0, 6).map((book) => {
                  const landed = landedCost(book as never);
                  const m = marginPct(Number(book["price"] ?? 0), landed);
                  return (
                    <tr key={String(book["id"])}>
                      <td className="p-2">{String(book["title"] ?? "—")}</td>
                      <td className="p-2">{formatTRY(Number(book["price"] ?? 0))}</td>
                      <td className="p-2 text-muted-foreground">{formatTRY(landed)}</td>
                      <td className={`p-2 font-semibold ${m < 20 ? "text-destructive" : "text-success"}`}>{m.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
          <h2 className="text-xl">Operations snapshot</h2>
          <div className="mt-4 space-y-3">
            <ModuleSummaryCard title="Payments" subtitle="Awaiting dekont review" badge={String(counts?.payments ?? 0)} />
            <ModuleSummaryCard title="Orders" subtitle="Orders placed in total" badge={String(counts?.orders ?? 0)} />
            <ModuleSummaryCard title="Customers" subtitle="Registered accounts" badge={String(counts?.customers ?? 0)} />
            <ModuleSummaryCard title="Inventory" subtitle="SKUs below reorder threshold" badge={String(lowStock.length)} />
          </div>
        </section>
      </div>
    </div>
  );
}

function ProofLink({ path }: { path: string }) {
  const [url, setUrl] = useState<string | null>(null);
  return (
    <button
      type="button"
      onClick={async () => {
        if (path.startsWith("http")) {
          window.open(path, "_blank", "noreferrer");
          return;
        }
        const { data, error } = await supabase.storage.from("payment-proofs").createSignedUrl(path, 60 * 10);
        if (error || !data) return;
        setUrl(data.signedUrl);
        window.open(data.signedUrl, "_blank", "noreferrer");
      }}
      className="rounded-md border border-border px-3 py-1.5 text-xs font-bold"
    >
      {url ? "Open again" : "View dekont"}
    </button>
  );
}

function PaymentPanel() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-payment-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,order_number,full_name,email,total,currency,payment_status,status,payment_proof_path,payment_proof_uploaded_at,created_at")
        .in("payment_status", ["pending", "pending_verification"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const decide = async (id: string, approved: boolean) => {
    const note = approved ? "Bank transfer verified by staff" : "Payment proof rejected by staff";
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: approved ? "paid" : "rejected",
        status: approved ? "paid" : "pending_payment",
        payment_verified_at: approved ? new Date().toISOString() : null,
        payment_review_note: note,
      })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    await supabase.from("order_events").insert({
      order_id: id,
      status: approved ? "paid" : "payment_rejected",
      note,
      created_by: userData.user?.id ?? null,
    });
    toast.success(approved ? "Payment confirmed" : "Payment rejected");
    queryClient.invalidateQueries({ queryKey: ["admin-payment-orders"] });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-panel">
        <h2 className="text-xl">Bank transfers to verify</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Orders stay in “Paiement à vérifier” until a dekont is confirmed here.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && <tr><td className="p-4" colSpan={5}>Loading…</td></tr>}
              {!isLoading && orders?.length === 0 && <tr><td className="p-4" colSpan={5}>No payment proofs awaiting review.</td></tr>}
              {orders?.map((order) => (
                <tr key={order.id}>
                  <td className="p-3">#{order.order_number}</td>
                  <td className="p-3">
                    <div>{order.full_name}</div>
                    <div className="text-xs text-muted-foreground">{order.email}</div>
                  </td>
                  <td className="p-3">{formatCurrency(order.total, (order.currency || "TRY") as Currency)}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-warning/15 px-2 py-1 text-xs font-semibold text-warning">
                      {order.payment_status === "pending_verification" ? "Paiement à vérifier" : "Awaiting transfer"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {order.payment_proof_path && <ProofLink path={order.payment_proof_path} />}
                      <button onClick={() => decide(order.id, true)} className="rounded-md bg-ink px-3 py-1.5 text-xs font-bold text-ink-foreground">Confirm</button>
                      <button onClick={() => decide(order.id, false)} className="rounded-md border border-destructive px-3 py-1.5 text-xs font-bold text-destructive">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GenericModule({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-panel">
      <h2 className="text-xl">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <ModuleSummaryCard title="Today" subtitle="Live status" badge="On" />
        <ModuleSummaryCard title="This week" subtitle="Updated items" badge="12" />
        <ModuleSummaryCard title="Needs review" subtitle="Action queue" badge="3" />
      </div>
    </div>
  );
}

function AdminPage() {
  const { data: session, isLoading } = useSession();
  const { isStaff, loading } = useRoles();
  const [active, setActive] = useState<ModuleKey>("dashboard");

  const activeLabel = useMemo(() => moduleMeta.find((m) => m.key === active)?.label ?? "Dashboard", [active]);

  if (isLoading || loading) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!session || !isStaff) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="text-2xl">Staff access only</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your account does not have an operations role yet.</p>
          <Link to="/account" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-ink-foreground">Sign in</Link>
        </div>
      </div>
    );
  }

  const moduleContent = (() => {
    switch (active) {
      case "dashboard":
        return <DashboardPanel />;
      case "books":
        return <CrudSection table="books" title="Books" description="Catalogue, pricing, stock and best-seller signals." fields={BOOK_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["title", "isbn", "slug"]} />;
      case "categories":
        return <CrudSection table="categories" title="Categories" description="Merchandising and browse filters." fields={CATEGORY_FIELDS} select="*" orderBy={{ column: "sort_order", ascending: true }} searchKeys={["name_tr", "name_en", "name_fr"]} />;
      case "collections":
        return <CrudSection table="collections" title="Collections" description="Curated landing pages and editorial bundles." fields={COLLECTION_FIELDS} select="*" orderBy={{ column: "sort_order", ascending: true }} searchKeys={["title_tr", "title_en", "title_fr"]} />;
      case "suppliers":
        return <CrudSection table="suppliers" title="Suppliers" description="Procurement partners and lead times." fields={SUPPLIER_FIELDS} select="*" orderBy={{ column: "name", ascending: true }} searchKeys={["name", "contact_name", "email"]} />;
      case "homepage":
        return <CrudSection table="homepage_sections" title="Homepage" description="homepage_sections used for homepage rails and collection blocks." fields={HOMEPAGE_FIELDS} select="*" orderBy={{ column: "sort_order", ascending: true }} searchKeys={["key", "title_tr", "title_en", "title_fr"]} />;
      case "promotions":
        return <CrudSection table="promotions" title="Promotions" description="Coupons and seasonal campaigns." fields={PROMOTION_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["code", "description"]} />;
      case "reviews":
        return <CrudSection table="reviews" title="Reviews" description="Customer sentiment and moderation queue." fields={REVIEW_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["title", "comment", "book_id"]} />;
      case "settings":
        return <CrudSection table="settings" title="Settings" description="Storefront configuration and operational flags." fields={SETTINGS_FIELDS} select="*" orderBy={{ column: "category", ascending: true }} searchKeys={["key", "label", "value"]} />;
      case "payments":
        return <PaymentPanel />;
      case "orders":
        return <CrudSection table="orders" title="Orders" description="Order lifecycle, fulfilment and shipping handoff." fields={ORDER_FIELDS} select="id,order_number,full_name,email,status,payment_status,total,shipping_carrier,tracking_number" orderBy={{ column: "created_at", ascending: false }} searchKeys={["order_number", "full_name", "email", "status"]} />;
      case "customers":
        return <CrudSection table="profiles" title="Customers" description="Profiles, retention and communication preferences." fields={CUSTOMER_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["full_name", "phone", "locale"]} />;
      case "inventory":
        return <CrudSection table="inventory_movements" title="Inventory" description="Stock movements and purchase planning history." fields={INVENTORY_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["book_id", "reason", "reference"]} />;
      case "content":
        return (
          <div className="space-y-8">
            <CrudSection table="site_content" title="Site text (CMS)" description="Every public text block on the storefront, in Turkish, English and French." fields={SITE_CONTENT_FIELDS} select="*" orderBy={{ column: "group_name", ascending: true }} searchKeys={["key", "label", "group_name", "value_en", "value_fr", "value_tr"]} />
            <CrudSection table="blog_posts" title="Articles" description="Long-form content and editorial updates." fields={BLOG_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["slug", "title", "excerpt"]} />
          </div>
        );
      case "media":
        return <CrudSection table="media_assets" title="Media Library" description="Upload, name and reuse every image used across the storefront." fields={MEDIA_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["file_name", "alt_text", "folder"]} />;
      case "marketing":
        return <CrudSection table="ambassadors" title="Marketing" description="Referral partners and campaign attribution." fields={AMBASSADOR_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["name", "email", "code"]} />;
      case "shipping":
        return <CrudSection table="purchase_orders" title="Shipping" description="Inbound procurement and delivery planning." fields={PURCHASE_ORDER_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["po_number", "supplier_id", "status"]} />;
      case "analytics":
        return <CrudSection table="analytics_events" title="Analytics" description="Traffic, conversion and product trend events." fields={[{ name: "name", label: "Event", type: "text" as const, required: true }, { name: "source", label: "Source", type: "text" as const }, { name: "campaign", label: "Campaign", type: "text" as const }]} select="id,name,source,campaign,created_at" orderBy={{ column: "created_at", ascending: false }} searchKeys={["name", "source", "campaign"]} />;
      case "admins":
        return (
          <div className="space-y-8">
            <CrudSection table="user_roles" title="Roles & access" description="Grant or revoke staff access. A user can hold several roles." fields={ROLE_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["user_id", "role"]} />
            <CrudSection table="profiles" title="Accounts" description="User accounts and contact details. Deleting removes the account entirely." fields={CUSTOMER_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["full_name", "phone"]} removeOverride={async (id) => { await deleteAdminUser({ data: { userId: id } }); }} />
          </div>
        );
      case "activity":
        return <CrudSection table="audit_logs" title="Activity Log" description="Audit trail for changes across the control center." fields={[{ name: "action", label: "Action", type: "text" as const }, { name: "entity", label: "Entity", type: "text" as const }, { name: "entity_id", label: "Entity ID", type: "text" as const }]} select="id,action,entity,entity_id,created_at" orderBy={{ column: "created_at", ascending: false }} searchKeys={["action", "entity", "entity_id"]} />;
      default:
        return <DashboardPanel />;
    }
  })();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full bg-ink text-ink-foreground lg:w-72 lg:shrink-0">
          <div className="flex h-20 items-center justify-between border-b border-ink-foreground/10 px-5">
            <div>
              <span className="font-serif text-2xl tracking-[0.14em]">LIVORA</span>
              <p className="text-[10px] font-bold tracking-[0.28em] text-accent">CONTROL CENTER</p>
            </div>
            <Link to="/" className="text-[10px] underline text-ink-foreground/70">Storefront</Link>
          </div>
          <nav className="space-y-1 p-3">
            {moduleMeta.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  active === key ? "bg-accent text-accent-foreground" : "text-ink-foreground/75 hover:bg-ink-foreground/10"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-5 md:p-8">
          <header className="mb-6 flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">Admin</p>
              <h1 className="mt-1 text-3xl">{activeLabel}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-secondary px-2.5 py-1">Operations</span>
              <span>{session.user.email}</span>
            </div>
          </header>
          {moduleContent}
        </main>
      </div>
    </div>
  );
}

function TrendingUpIcon(props: React.ComponentProps<typeof Activity>) {
  return <Activity {...props} />;
}
