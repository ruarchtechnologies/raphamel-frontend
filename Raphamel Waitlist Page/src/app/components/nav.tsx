export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#0071DC] rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-xl">R</span>
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="font-bold text-white text-xl">
            Raphamel
          </span>
        </div>
        
        <div 
          style={{ fontFamily: "'DM Mono', monospace" }}
          className="px-4 py-2 bg-[#FACC15] text-[#0F172A] rounded-full text-xs font-semibold uppercase tracking-wide"
        >
          Now Accepting Early Members
        </div>
      </div>
    </nav>
  );
}
