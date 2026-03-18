export function StatsBand() {
  const stats = [
    { value: '15K+', label: 'Products', color: 'text-white' },
    { value: '800+', label: 'Suppliers', color: 'text-[#FACC15]' },
    { value: '1,200+', label: 'Waitlist', color: 'text-white' },
  ];

  return (
    <section className="bg-[#060E1C] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}
              >
                {stat.value}
              </div>
              <div
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-[#94A3B8] uppercase tracking-wide text-sm"
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
