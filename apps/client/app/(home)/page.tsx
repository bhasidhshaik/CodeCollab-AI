import { Suspense } from "react";
import { RoomAccessForm } from "@/components/room-access-form";
import { Status } from "@/components/status";

export default async function Page({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const roomId = params.room?.toString() || "";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#080808] text-white">

      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-0 z-0 h-[400px] w-[600px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[10%] top-[200px] z-0 h-[300px] w-[300px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(251,86,138,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-[10%] top-[200px] z-0 h-[300px] w-[300px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(59,119,253,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Floating Navbar */}
   <div className="sticky top-4 z-50 flex justify-center px-6 pt-4">
  <nav className="relative flex w-full max-w-3xl items-center justify-between rounded-full
    bg-white/1 border border-white/20 
    backdrop-blur-lg shadow-lg px-5 py-3">

    {/* subtle glass highlight */}
    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white/3" />

    <div className="flex items-center gap-2">
      <div
        className="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold text-white"
        style={{ background: "linear-gradient(135deg, #fb568a, #a855f7)" }}
      >
        C
      </div>
      <span className="text-sm font-medium text-white">CodeCollab AI</span>
    </div>

    <div className="hidden items-center gap-6 sm:flex">
      <a className="text-xs text-white/50 hover:text-white transition-colors" href="#features">Features</a>
      <a className="text-xs text-white/50 hover:text-white transition-colors" href="#">GitHub</a>
      <a className="text-xs text-white/50 hover:text-white transition-colors" href="#status">Status</a>
    </div>

   <a
  href="#get-started"
  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium text-white
  bg-[#f01f7d]
  shadow-[0_4px_18px_rgba(255,46,99,0.0145)]
  transition-all hover:bg-[#e11d48] hover:scale-[1.03] active:scale-[0.98]"
>
  Get Started
</a>
  </nav>
</div>

      {/* Hero Section */}
      <main
        className="relative z-10 flex flex-col items-center px-6 pb-12 pt-16 text-center"
        id="get-started"
      >
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/8 px-4 py-1.5 backdrop-blur-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
          <span className="text-[11px] text-purple-400/85">Now with AI assistant</span>
        </div>

        {/* Headline */}
        <h1 className="mb-5 max-w-2xl text-5xl font-bold leading-[1.08] tracking-[-2px] sm:text-6xl">
          The{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #fb568a, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI-powered
          </span>
          <br />
          <span className="text-white/30">code collaboration</span>
          <br />
          space.
        </h1>

        {/* Subheadline */}
        <p className="mb-10 max-w-sm text-[15px] leading-relaxed text-white/40">
          Real-time collaboration, AI code review, shared terminal and live
          preview — no sign-up required.
        </p>

        {/* Glass Form Card */}
        <div className="relative w-full max-w-md">
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
            }}
          />
          <div className="relative rounded-2xl border border-white/20 bg-white/4 p-7 backdrop-blur-2xl">
            <Suspense fallback={null}>
              <RoomAccessForm roomId={roomId} />
            </Suspense>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-5 flex flex-wrap justify-center gap-5">
          {["No sign-up", "Free to use", "AI powered", "Open source"].map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-[11px] text-white/20">
              <span className="h-1 w-1 rounded-full bg-purple-500/60" />
              {item}
            </span>
          ))}
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 pb-24" id="features">
        <p className="mb-4 text-center text-[11px] uppercase tracking-widest text-white/25">
          Features
        </p>
        <h2 className="mb-3 text-center text-3xl font-medium tracking-tight">
          Everything you need<br />to code together
        </h2>
        <p className="mb-12 text-center text-sm text-white/35">
          A full-featured collaborative IDE, right in your browser.
        </p>

        <div
          className="grid grid-cols-1 p-4 gap-4 border-t border-white/5 sm:grid-cols-2 lg:grid-cols-3"
          
        >
          {[
            { icon: "⟨/⟩", title: "Real-time Collaboration", desc: "Code together with cursor sharing, highlighting, and follow mode", color: "rgba(251,86,138,0.08)", isNew: false },
            { icon: "✦", title: "AI Assistant", desc: "Gemini-powered chat, code review and bug fixing built right in", color: "rgba(168,85,247,0.08)", isNew: true },
            { icon: ">_", title: "Shared Terminal", desc: "Execute code together with over 80 supported languages", color: "rgba(59,119,253,0.08)", isNew: false },
            { icon: "⎇", title: "GitHub Integrated", desc: "Open and save files directly from your repositories", color: "rgba(20,184,166,0.08)", isNew: false },
            { icon: "⊞", title: "Live Preview", desc: "Preview UI changes instantly with Tailwind CSS and more", color: "rgba(234,179,8,0.08)", isNew: false },
            { icon: "▶", title: "Video & Voice", desc: "Communicate with your team using built-in video and voice", color: "rgba(239,68,68,0.08)", isNew: false },
          ].map((feat) => (
            <div
              key={feat.title}
              className="relative cursor-pointer bg-[#080808] px-7 py-8 rounded-lg border border-white/5 transition-colors hover:bg-white/5"
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
              />
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/6 text-lg"
                style={{ background: feat.color }}
              >
                {feat.icon}
              </div>
              <h3 className="mb-2 text-sm font-medium text-white/90">
                {feat.title}
              </h3>
              <p className="text-xs leading-relaxed text-white/35">{feat.desc}</p>
              {feat.isNew && (
                <span className="mt-3 inline-block rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-purple-400/80">
                  New
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col items-center justify-between gap-2 border-t border-white/5 px-12 py-5 sm:flex-row" id="status">
        <p className="text-xs text-white/18">© 2026 CodeX — No sign-up required</p>
        <div className="flex items-center gap-3">
          <Status />
          <p className="text-xs text-white/18">Built with Next.js · Powered by Gemini AI</p>
        </div>
      </footer>

    </div>
  );
}