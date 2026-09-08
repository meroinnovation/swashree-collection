import Link from "next/link";

export default function StudioSetup() {
  return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 560, textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#e11d48" }}>
          Swashree Collection Admin
        </p>
        <h1 style={{ marginTop: 12, fontSize: 28, fontWeight: 700, color: "#1c1917" }}>
          Admin panel not connected yet
        </h1>
        <p style={{ marginTop: 12, color: "#57534e", lineHeight: 1.6 }}>
          Add your Sanity project details to the <code style={{ background: "#f5f5f4", padding: "2px 6px", borderRadius: 6 }}>.env.local</code> file
          (or environment variables in Vercel) and redeploy:
        </p>
        <pre
          style={{
            marginTop: 16,
            textAlign: "left",
            background: "#1c1917",
            color: "#d6d3d1",
            padding: 16,
            borderRadius: 12,
            fontSize: 13,
            overflowX: "auto",
          }}
        >
{`NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=your_token`}
        </pre>
        <p style={{ marginTop: 16, fontSize: 14, color: "#57534e" }}>
          Don&apos;t have a Sanity project yet?{" "}
          <a href="https://www.sanity.io" target="_blank" rel="noreferrer" style={{ color: "#e11d48", fontWeight: 600 }}>
            Create a free one
          </a>{" "}
          (5 min), then come back and hit refresh.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: 20,
            borderRadius: 999,
            background: "#9f1239",
            color: "#fff",
            padding: "10px 24px",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Back to store
        </Link>
      </div>
    </div>
  );
}