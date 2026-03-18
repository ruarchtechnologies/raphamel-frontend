export function TrustBar() {
  return (
    <section className="bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[#334155] font-semibold uppercase tracking-wide text-sm">
            Built For:
          </div>
          
          {['Hospitals', 'Clinics', 'Pharmacies', 'Labs', 'NGOs'].map((item, i) => (
            <div 
              key={i}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-[#334155] font-medium text-sm"
            >
              {item}
            </div>
          ))}

          <div className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/[0.12] rounded-full">
            <div className="w-2 h-2 bg-[#22C55E] rounded-full" />
            <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#22C55E] font-semibold uppercase tracking-wide">
              NAFDAC Compliant
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
