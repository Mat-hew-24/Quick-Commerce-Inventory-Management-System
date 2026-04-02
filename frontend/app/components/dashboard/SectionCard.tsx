import type { ReactNode } from "react";

export default function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
