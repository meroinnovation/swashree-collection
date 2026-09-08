export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 h-8 w-56 animate-pulse rounded-full bg-stone-100" />
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-stone-100 bg-white">
            <div className="aspect-square rounded-t-2xl bg-stone-100" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 rounded bg-stone-100" />
              <div className="h-5 w-1/3 rounded bg-rose-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}