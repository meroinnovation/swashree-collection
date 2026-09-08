export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  center?: boolean;
}) {
  return (
    <div className={`mb-8 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-600">{eyebrow}</p>
      )}
      <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
        {title}
      </h2>
      {subtitle && <p className={`mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-500`}>{subtitle}</p>}
      {action && (
        <a
          href={action.href}
          className="mt-5 inline-flex items-center gap-1 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-rose-400 hover:text-rose-700"
        >
          {action.label} →
        </a>
      )}
    </div>
  );
}