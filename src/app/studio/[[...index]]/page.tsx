import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isConfigured } from "@/sanity/env";
import StudioSetup from "./StudioSetup";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isConfigured) {
    return <StudioSetup />;
  }
  return <NextStudio config={config} />;
}