export function Footer() {
  return (
    <footer className="bg-[#060E1C] py-8 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0071DC] rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-sm">R</span>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="font-bold text-white">
              Raphamel
            </span>
          </div>

          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[#64748B] text-sm">
            © 2025 Raphamel. Healthcare Commerce, Connected.
          </p>

          <div className="flex gap-6">
            <a
              href="#"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-[#64748B] hover:text-white text-sm transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-[#64748B] hover:text-white text-sm transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-[#64748B] hover:text-white text-sm transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
