"use client";

import { useState } from "react";
import { SmartImage } from "@/components/image";
import type { ProductImage } from "@/lib/sanity";

export default function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images?.length ? images : [{ url: undefined }];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-stone-100">
        <SmartImage
          src={list[active].url}
          alt={`${name} image ${active + 1}`}
          priority
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover"
        />
      </div>
      {list.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                active === i ? "border-rose-600" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <SmartImage src={img.url} alt={`${name} thumbnail ${i + 1}`} sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}