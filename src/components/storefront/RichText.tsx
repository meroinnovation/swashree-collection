import type { ReactNode } from "react";
import { PortableText, type PortableTextComponentProps, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "@/lib/sanity";

const components: PortableTextComponents = {
  block: ({ children, value }: PortableTextComponentProps<PortableTextBlock>) => {
    switch (value?.style) {
      case "h2":
        return <h2 className="font-display mb-3 mt-6 text-xl font-bold text-stone-900">{children}</h2>;
      case "h3":
        return <h3 className="font-display mb-2 mt-5 text-lg font-bold text-stone-900">{children}</h3>;
      case "blockquote":
        return (
          <blockquote className="my-4 border-l-4 border-rose-300 pl-4 italic text-stone-600">
            {children}
          </blockquote>
        );
      case "normal":
      default:
        return <p className="mb-4 leading-relaxed text-stone-600">{children}</p>;
    }
  },
  list: {
    bullet: ({ children }: { children?: ReactNode }) => (
      <ul className="mb-4 list-disc space-y-1 pl-5 text-stone-600">{children}</ul>
    ),
    number: ({ children }: { children?: ReactNode }) => (
      <ol className="mb-4 list-decimal space-y-1 pl-5 text-stone-600">{children}</ol>
    ),
  },
  listItem: ({ children }: { children?: ReactNode }) => <li>{children}</li>,
  marks: {
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold text-stone-900">{children}</strong>
    ),
    em: ({ children }: { children?: ReactNode }) => <em>{children}</em>,
    link: ({ children, value }: { children?: ReactNode; value?: { href?: string } }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="text-rose-700 underline decoration-rose-300 underline-offset-2 hover:text-rose-800"
      >
        {children}
      </a>
    ),
  },
};

export default function RichText({ value }: { value: PortableTextBlock[] }) {
  if (!value || value.length === 0) return null;
  return <PortableText value={value as never} components={components as never} />;
}