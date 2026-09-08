import { defineType, defineField } from "sanity";

export default defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: () => "🧾",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      description: "Public reference shown to the customer.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customer",
      title: "Customer",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Full Name", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "city", title: "City / District", type: "string" }),
        defineField({ name: "address", title: "Delivery Address", type: "text", rows: 2 }),
        defineField({ name: "note", title: "Order Note", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "item",
          fields: [
            defineField({ name: "productId", title: "Product ID", type: "string" }),
            defineField({ name: "name", title: "Product Name", type: "string" }),
            defineField({ name: "price", title: "Unit Price (NPR)", type: "number" }),
            defineField({ name: "quantity", title: "Quantity", type: "number" }),
            defineField({ name: "size", title: "Size", type: "string" }),
            defineField({ name: "color", title: "Color", type: "string" }),
            defineField({ name: "image", title: "Image URL", type: "url" }),
          ],
        },
      ],
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal (NPR)",
      type: "number",
    }),
    defineField({
      name: "discount",
      title: "Discount (NPR)",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "deliveryFee",
      title: "Delivery Fee (NPR)",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "total",
      title: "Total (NPR)",
      type: "number",
    }),
    defineField({
      name: "couponCode",
      title: "Coupon Code",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "Cash on Delivery", value: "cod" },
          { title: "eSewa", value: "esewa" },
          { title: "Khalti", value: "khalti" },
        ],
      },
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Payment Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "orderStatus",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "transactionId",
      title: "Transaction ID",
      type: "string",
      description: "Gateway reference (eSewa refId / Khalti pidx / transaction).",
      readOnly: true,
    }),
    defineField({
      name: "courier",
      title: "Courier / Tracking",
      type: "string",
    }),
  ],
  initialValue: {
    paymentStatus: "pending",
    orderStatus: "new",
    discount: 0,
    deliveryFee: 0,
  },
  preview: {
    select: {
      title: "orderNumber",
      customer: "customer.name",
      total: "total",
      med: "paymentMethod",
    },
    prepare(selection) {
      const med = (selection.med || "").toUpperCase();
      return {
        title: `${selection.title}  ·  ${med}`,
        subtitle: selection.customer
          ? `${selection.customer}  —  Rs. ${selection.total}`
          : `Rs. ${selection.total}`,
      };
    },
  },
  orderings: [
    {
      title: "Newest First",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});