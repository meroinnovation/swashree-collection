export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-06-01";
export const readToken = process.env.SANITY_API_READ_TOKEN || "";
export const writeToken = process.env.SANITY_API_WRITE_TOKEN || "";
export const useCdn = process.env.NEXT_PUBLIC_SANITY_USE_CDN === "true";

export const isConfigured = Boolean(projectId);