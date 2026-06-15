const stats = [
  {
    id: 1,
    value: "100%",
    name: "Free for Beta Members",
    sub: "No credit card, no limits",
    gradient: "from-blue-500/25 to-indigo-500/10",
    accent: "text-blue-400",
    border: "border-blue-500/20",
  },
  {
    id: 2,
    value: "< 60s",
    name: "Setup to First Invoice",
    sub: "The fastest onboarding in the industry",
    gradient: "from-emerald-500/25 to-teal-500/10",
    accent: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    id: 3,
    value: "Zero",
    name: "Credit Card Required",
    sub: "Start immediately, pay nothing",
    gradient: "from-purple-500/25 to-pink-500/10",
    accent: "text-purple-400",
    border: "border-purple-500/20",
  },
];

export function StatsSection() {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden bg-[#060812]">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 h-80 w-80 rounded-full bg-blue-500/8 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Built for{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(130deg, #a5b4fc 0%, #34d399 100%)" }}
            >
              growing businesses
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 max-w-xl mx-auto">
            We're in open beta — join now and get full access at no cost while we build the best business operations platform on the market.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 max-w-5xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`relative flex flex-col items-center rounded-3xl border ${stat.border} bg-white/4 p-10 backdrop-blur-md overflow-hidden group hover:bg-white/6 hover:border-opacity-40 transition-all duration-300`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none`} />
              <div className="relative z-10 text-center">
                <p className={`text-5xl sm:text-6xl font-black tracking-tight ${stat.accent} mb-3`}>
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-white mb-1.5">{stat.name}</p>
                <p className="text-xs text-slate-500">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
