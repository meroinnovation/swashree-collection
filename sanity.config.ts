"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";
import { dataset, projectId, apiVersion } from "./src/sanity/env";

export default defineConfig({
  name: "swashree-collection",
  title: "Swashree Collection Admin",
  projectId: projectId || "placeholder",
  dataset: dataset,
  apiVersion,
  basePath: "/studio",
  plugins: [
    structureTool({
      title: "Admin",
      structure,
    }),
    visionTool({ title: "Queries" }),
  ],
  schema: { types: schemaTypes },
});

export const projectName = "Swashree Collection";
export const setupGuideUrl =
  "https://www.sanity.io/manage";