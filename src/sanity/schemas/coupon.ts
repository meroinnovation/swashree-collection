import { defineField, defineType } from "sanity";

export default defineType({
  name: "coupon",
  title: "Coupon",
  type: "document",
  icon: () => "🎟️",
  fields: [
    defineField({
      name: "code",
      title: "Coupon Code",
      type: "string",
      description: "e.g. WELCOME10",
      validation: (Rule) =>
        Rule.required()
          .uppercase()
          .custom((code) => /^[A-Z0-9-]+$/.test(code || "") || "Use only letters, numbers and dashes."),
    }),
    defineField({
      name: "discountType",
      title: "Discount Type",
      type: "string",
      options: {
        list: [
          { title: "Percentage (%)", value: "percent" },
          { title: "Flat amount (NPR)", value: "flat" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "discountValue",
      title: "Discount Value",
      description: "e.g. 10 (for 10%) or 500 (for Rs. 500 off).",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "minOrderAmount",
      title: "Minimum Order Amount (NPR)",
      description: "Leave empty for no minimum.",
      type: "number",
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: "expiresAt",
      title: "Expiry Date",
      type: "datetime",
    }),
    defineField({
      name: "maxUses",
      title: "Maximum Total Uses",
      type: "number",
      validation: (Rule) => Rule.integer().min(1),
    }),
    defineField({
      name: "usedCount",
      title: "Times Used",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "code", active: "isActive" },
    prepare({ title, active }) {
      return {
        title,
        subtitle: active ? "Active" : "Disabled",
      };
    },
  },
});