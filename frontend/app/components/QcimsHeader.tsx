type QcimsHeaderProps = {
  role: "admin" | "staff";
  onLogout: () => void;
};

export default function QcimsHeader({ role, onLogout }: QcimsHeaderProps) {
  return (
    <header className="mb-7 w-full rounded-xl bg-slate-900 p-6 text-slate-100 shadow-xl ring-1 ring-slate-200/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">
            Quick Commerce Inventory Management System
          </h1>
          <p className="mt-2 text-sm text-slate-200 md:text-base">
            Real-time overview for Products, Warehouses, Inventory, Orders and
            Restocks.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
            {role}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md border border-slate-600 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-400 hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
