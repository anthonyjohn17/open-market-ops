import { useState } from "react";

type Page = "home" | "framework" | "wedges" | "roadmap" | "docs";

const WEDGES = [
  { id: "hiring-signals", status: "MVP", pitch: "Job postings → AI agency leads" },
  { id: "distressed-saas", status: "Soon", pitch: "Under-maintained SaaS acquisitions" },
  { id: "local-closures", status: "Soon", pitch: "Distressed local business assets" },
  { id: "expired-domains", status: "Soon", pitch: "SEO & lead-gen domain opportunities" },
];

const STEPS = [
  { name: "Feed", q: "What raw signals enter the market?" },
  { name: "Asset", q: "What mispriced thing is in the signal?" },
  { name: "Trigger", q: "Why act now?" },
  { name: "Buyer", q: "Who pays?" },
  { name: "Monetize", q: "How do you capture value?" },
];

const NAV: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "framework", label: "Framework" },
  { id: "wedges", label: "Wedges" },
  { id: "roadmap", label: "Roadmap" },
  { id: "docs", label: "Docs" },
];

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
              Open Market Ops
            </p>
            <h1 className="text-2xl font-semibold text-white">OpportunityOS</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setPage(n.id)}
                className={`rounded px-3 py-1.5 text-sm ${
                  page === n.id
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {page === "home" && <HomePage />}
        {page === "framework" && <FrameworkPage />}
        {page === "wedges" && <WedgesPage />}
        {page === "roadmap" && <RoadmapPage />}
        {page === "docs" && <DocsPage />}
      </main>
    </div>
  );
}

function HomePage() {
  return (
    <section className="space-y-6">
      <p className="text-lg text-slate-400 max-w-2xl">
        Open-source <strong className="text-slate-200">liquidity intelligence</strong> — detect
        economic asymmetry from public signals.
      </p>
      <p className="font-mono text-sm text-emerald-300/90">Signal → Spread → Match → Monetize</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((s, i) => (
          <div key={s.name} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <span className="text-xs text-slate-500">{i + 1}</span>
            <h3 className="font-medium text-emerald-400">{s.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{s.q}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FrameworkPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h2 className="text-xl font-semibold text-white">Five-step framework</h2>
      <p className="text-slate-400 mt-4">
        OpportunityOS encodes liquidity intelligence as structured opportunity objects — not scraper
        rows. Every output validates against JSON Schema.
      </p>
      <ul className="mt-4 space-y-2 text-slate-300 list-disc pl-5">
        <li>MVP runtime: feed connectors, signal engine, scoring, outputs</li>
        <li>v0.2: buyer-matching + monetization-engine (framework_complete: true)</li>
      </ul>
    </article>
  );
}

function WedgesPage() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white">OSS wedges</h2>
      <ul className="mt-6 space-y-3">
        {WEDGES.map((w) => (
          <li
            key={w.id}
            className="flex items-center justify-between rounded-lg border border-slate-800 px-4 py-3"
          >
            <div>
              <span className="font-mono text-sm text-slate-300">{w.id}</span>
              <p className="text-sm text-slate-500">{w.pitch}</p>
            </div>
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                w.status === "MVP"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {w.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RoadmapPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Future visuals (post-MVP)</h2>
      <p className="text-slate-400">
        Planned UI communicates liquidity intelligence — not generic chat chrome.
      </p>
      <ul className="space-y-2 text-slate-300">
        <li>Force-directed opportunity graph (Cytoscape / react-force-graph)</li>
        <li>Trigger timeline with SSE or WebSockets</li>
        <li>Liquidity heatmaps and acquisition radar</li>
        <li>Operator terminal in apps/dashboard</li>
      </ul>
      <p className="text-sm text-slate-500">
        See docs/FUTURE-EXPANSION.md in the GitHub repository.
      </p>
    </section>
  );
}

function DocsPage() {
  return (
    <section className="space-y-4 text-slate-300">
      <h2 className="text-xl font-semibold text-white">Repository docs</h2>
      <ul className="space-y-2">
        <li>
          <code className="text-emerald-300">docs/PRD-MVP.md</code> — MVP requirements
        </li>
        <li>
          <code className="text-emerald-300">docs/FUTURE-EXPANSION.md</code> — roadmap
        </li>
        <li>
          <code className="text-emerald-300">concept.md</code> — business framework
        </li>
        <li>
          <code className="text-emerald-300">workflows/hiring-signals.yaml</code> — reference wedge
        </li>
      </ul>
      <pre className="rounded-lg bg-slate-950 p-4 text-xs overflow-x-auto">
        {`MOCK_FEEDS=true pnpm omo run workflows/hiring-signals.yaml --output ./out`}
      </pre>
    </section>
  );
}
