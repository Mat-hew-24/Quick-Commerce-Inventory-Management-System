type SummaryCardProps = {
  title: string;
  value: number;
  subtitle: string;
};

export default function SummaryCard({
  title,
  value,
  subtitle,
}: SummaryCardProps) {
  return (
    <article className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-xl p-5 shadow-2xl ring-1 ring-slate-900/10 w-full md:w-[260px]">
      <h3 className="font-semibold text-xs uppercase tracking-wider opacity-90">
        {title}
      </h3>
      <div className="mt-3 text-4xl font-bold tracking-tight">{value}</div>
      <p className="text-xs opacity-90 mt-2">{subtitle}</p>
    </article>
  );
}
