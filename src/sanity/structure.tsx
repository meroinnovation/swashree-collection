import { type StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Admin")
    .items([
      S.listItem()
        .title("Dashboard")
        .id("dashboard")
        .icon(() => "🏠")
        .child(
          S.component(() => (
            <div style={{ padding: 24 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700 }}>Welcome to Swashree Collection Admin</h1>
              <p style={{ marginTop: 12, color: "#666" }}>
                Manage your products, categories, orders and coupons below. Changes go live on the
                website within a minute.
              </p>
            </div>
          ))
        ),
      S.divider(),
      S.listItem()
        .title("Products")
        .icon(() => "🛍️")
        .child(S.documentTypeList("product").title("Products")),
      S.listItem()
        .title("Categories")
        .icon(() => "🏷️")
        .child(S.documentTypeList("category").title("Categories")),
      S.divider(),
      S.listItem()
        .title("Orders")
        .icon(() => "🧾")
        .child(S.documentTypeList("order").title("Orders")),
      S.listItem()
        .title("Coupons")
        .icon(() => "🎟️")
        .child(S.documentTypeList("coupon").title("Coupons")),
      S.divider(),
      S.listItem()
        .title("Site Settings")
        .icon(() => "⚙️")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings").title("Site Settings")
        ),
    ]);