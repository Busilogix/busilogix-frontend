const stats = [
  { id: 1, name: "Free during Open Beta", value: "100%", gradient: "from-blue-500/20 to-indigo-500/10" },
  { id: 2, name: "Setup to first invoice", value: "< 60s", gradient: "from-emerald-500/20 to-teal-500/10" },
  { id: 3, name: "Credit card required", value: "Zero", gradient: "from-purple-500/20 to-pink-500/10" },
];

export function StatsSection() {
  return (
    <section className="bg-slate-950 py-24 sm:py-32 relative overflow-hidden">
      {/* Abstract dark mode background gradients */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/5 via-slate-950 to-slate-950" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:max-w-none text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Transparent, zero-friction access
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-8 text-slate-400 max-w-xl mx-auto">
            We are currently in open beta. Experience a modern platform with no upfront costs, no hidden fees, and no artificial limits.
          </p>
          
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="relative flex flex-col justify-center items-center rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-md overflow-hidden group hover:border-slate-700/80 transition-all duration-300 shadow-2xl"
              >
                {/* Glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none`} />

                <dd className="text-4xl font-black tracking-tight text-white sm:text-5xl mb-2 relative z-10 bg-clip-text">
                  {stat.value}
                </dd>
                <dt className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400 relative z-10">
                  {stat.name}
                </dt>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
