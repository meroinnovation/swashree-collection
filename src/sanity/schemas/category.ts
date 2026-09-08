import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: () => "🏷️",
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 80 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "orderRank",
      title: "Display Order",
      description: "Lower numbers appear first in menus.",
      type: "number",
      initialValue: 100,
    }),
  ],
  preview: {
    select: { title: "name", media: "image", subtitle: "orderRank" },
  },
  orderings: [
    {
      title: "Display Order",
      name: "rankAsc",
      by: [{ field: "orderRank", direction: "asc" }],
    },
  ],
});