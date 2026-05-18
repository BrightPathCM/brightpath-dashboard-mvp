import React, { useMemo, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type PageKey =
  | "Executive Overview"
  | "Schedule Health"
  | "Provider Performance"
  | "Production & Revenue"
  | "Cancellations"
  | "Recommendations"
  | "Alerts"
  | "Reports"
  | "Rules Engine";

type Severity = "green" | "yellow" | "red" | "blue";

const pages: PageKey[] = [
  "Executive Overview",
  "Schedule Health",
  "Provider Performance",
  "Production & Revenue",
  "Cancellations",
  "Recommendations",
  "Alerts",
  "Reports",
  "Rules Engine",
];

const productionData = [
  { day: "Mon", actual: 42300, goal: 39000 },
  { day: "Tue", actual: 38100, goal: 40000 },
  { day: "Wed", actual: 46600, goal: 41000 },
  { day: "Thu", actual: 51200, goal: 42000 },
  { day: "Fri", actual: 44700, goal: 40500 },
  { day: "Sat", actual: 21800, goal: 25000 },
];

const utilizationData = [
  { label: "Hygiene", value: 91 },
  { label: "Ops 1", value: 84 },
  { label: "Ops 2", value: 78 },
  { label: "Ops 3", value: 69 },
  { label: "Emerg.", value: 57 },
];

const healthTrend = [
  { week: "W1", score: 74 },
  { week: "W2", score: 77 },
  { week: "W3", score: 75 },
  { week: "W4", score: 81 },
  { week: "W5", score: 83 },
];

const providers = [
  { name: "Dr. Chen", role: "Owner Dentist", production: "$96.4k", acceptance: "78%", utilization: "91%", variance: "+12.8%" },
  { name: "Dr. Alvarez", role: "Associate", production: "$71.2k", acceptance: "69%", utilization: "84%", variance: "+4.5%" },
  { name: "J. Miles", role: "Hygienist", production: "$34.9k", acceptance: "82%", utilization: "93%", variance: "+9.1%" },
  { name: "N. Brooks", role: "Hygienist", production: "$29.6k", acceptance: "74%", utilization: "88%", variance: "-2.3%" },
];

const recommendations = [
  {
    title: "Open two high-value restorative blocks",
    body: "Thursday demand is pacing 18% above goal. Move low-acuity recalls to create two 90-minute treatment windows.",
    impact: "$18.5k upside",
    severity: "green" as Severity,
  },
  {
    title: "Tighten confirmation sequence",
    body: "Cancellation risk is concentrated in Friday hygiene. Trigger SMS plus call tasks for unconfirmed appointments over 36 hours.",
    impact: "11 visits at risk",
    severity: "yellow" as Severity,
  },
  {
    title: "Review provider mix on Monday",
    body: "Dr. Alvarez has excess diagnostic capacity while hygiene is constrained. Shift two exams from hygiene overflow.",
    impact: "6% utilization lift",
    severity: "blue" as Severity,
  },
];

const alerts = [
  { label: "Same-day cancellations", detail: "5 today, above 3-day baseline", severity: "red" as Severity },
  { label: "Unscheduled treatment", detail: "$142k in accepted care needs follow-up", severity: "yellow" as Severity },
  { label: "Goal pacing", detail: "Weekly production is 8.4% above plan", severity: "green" as Severity },
];

function severityClasses(severity: Severity) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    yellow: "bg-amber-50 text-amber-700 ring-amber-200",
    red: "bg-rose-50 text-rose-700 ring-rose-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
  };
  return map[severity];
}

function Sidebar({ active, onSelect }: { active: PageKey; onSelect: (page: PageKey) => void }) {
  return (
    <aside className="bp-sidebar desktop-sidebar left-0 top-0 z-20 flex w-full flex-col px-5 py-6 text-white lg:fixed lg:h-screen lg:w-72">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-500 font-extrabold shadow-lg shadow-blue-950/30">BP</div>
        <div>
          <div className="text-lg font-bold tracking-tight">Bright Path</div>
          <div className="text-xs font-medium text-slate-300">Practice intelligence</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onSelect(page)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
              active === page
                ? "bg-white text-slate-950 shadow-lg shadow-black/10"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{page}</span>
            {active === page ? <span className="h-2 w-2 rounded-full bg-blue-500" /> : null}
          </button>
        ))}
      </nav>

      <div className="rounded-lg border border-white/10 bg-white/10 p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-blue-200">Demo practice</div>
        <div className="mt-2 text-sm font-bold">Northline Dental Group</div>
        <div className="mt-1 text-xs leading-5 text-slate-300">Multi-provider view with mock operational data.</div>
      </div>
    </aside>
  );
}

function Header({ active }: { active: PageKey }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-canvas/90 px-6 py-4 backdrop-blur lg:px-8">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <p className="text-sm font-semibold text-blue-600">Bright Path Health Command</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{active}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">May 12-18, 2026</div>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
            Export briefing
          </button>
        </div>
      </div>
    </header>
  );
}

function KPICard({
  label,
  value,
  delta,
  helper,
  severity = "blue",
}: {
  label: string;
  value: string;
  delta: string;
  helper: string;
  severity?: Severity;
}) {
  return (
    <section className="bp-card rounded-lg p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">{value}</p>
        </div>
        <AlertBadge severity={severity}>{delta}</AlertBadge>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{helper}</p>
    </section>
  );
}

function AlertBadge({ severity, children }: { severity: Severity; children: React.ReactNode }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${severityClasses(severity)}`}>{children}</span>;
}

function HealthScoreCard() {
  return (
    <section className="bp-card rounded-lg p-6">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-slate-500">Bright Path Health Score</p>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-950">Strong momentum, watch access risk</h2>
        </div>
        <AlertBadge severity="green">+6 pts</AlertBadge>
      </div>

      <div className="mt-7 grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
        <div className="health-ring grid aspect-square place-items-center rounded-full p-4">
          <div className="grid h-full w-full place-items-center rounded-full bg-white shadow-inner">
            <div className="text-center">
              <div className="text-5xl font-extrabold tracking-tight text-slate-950">83</div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Healthy</div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[
            ["Production pace", 92, "bg-emerald-500"],
            ["Schedule utilization", 78, "bg-blue-500"],
            ["Case acceptance", 74, "bg-amber-500"],
            ["Cancellation control", 61, "bg-rose-500"],
          ].map(([label, value, color]) => (
            <div key={label as string}>
              <div className="mb-1.5 flex justify-between text-sm font-semibold">
                <span className="text-slate-600">{label}</span>
                <span className="text-slate-950">{value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={healthTrend}>
            <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={false} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="bp-card rounded-lg p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="h-72">{children}</div>
    </section>
  );
}

function ProductionChart() {
  return (
    <ChartCard title="Weekly production" subtitle="Actual production compared with practice goal">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={productionData} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="actualFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
          <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
          <Area type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} fill="url(#actualFill)" />
          <Line type="monotone" dataKey="goal" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function UtilizationChart() {
  return (
    <ChartCard title="Schedule utilization" subtitle="Operatory capacity used by schedule segment">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={utilizationData} layout="vertical" margin={{ top: 6, right: 18, left: 18, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
          <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={64} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={22}>
            {utilizationData.map((entry) => (
              <Cell key={entry.label} fill={entry.value >= 85 ? "#22c55e" : entry.value >= 70 ? "#2563eb" : "#f59e0b"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function ProviderTable() {
  return (
    <section className="bp-card overflow-hidden rounded-lg">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-950">Provider performance</h2>
        <p className="mt-1 text-sm text-slate-500">Production, acceptance, and utilization by provider</p>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3 font-bold">Provider</th>
              <th className="px-5 py-3 font-bold">Production</th>
              <th className="px-5 py-3 font-bold">Acceptance</th>
              <th className="px-5 py-3 font-bold">Utilization</th>
              <th className="px-5 py-3 font-bold">Variance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {providers.map((provider) => (
              <tr key={provider.name} className="bg-white">
                <td className="px-5 py-4">
                  <div className="font-bold text-slate-950">{provider.name}</div>
                  <div className="text-sm text-slate-500">{provider.role}</div>
                </td>
                <td className="px-5 py-4 font-semibold text-slate-800">{provider.production}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">{provider.acceptance}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">{provider.utilization}</td>
                <td className={`px-5 py-4 font-bold ${provider.variance.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>
                  {provider.variance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RecommendationCard({ recommendation }: { recommendation: (typeof recommendations)[number] }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-extrabold leading-5 text-slate-950">{recommendation.title}</h3>
        <AlertBadge severity={recommendation.severity}>{recommendation.impact}</AlertBadge>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-500">{recommendation.body}</p>
    </article>
  );
}

function RecommendationsPanel() {
  return (
    <section className="bp-card rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-950">Recommendations</h2>
          <p className="mt-1 text-sm text-slate-500">Operational moves ranked by impact</p>
        </div>
        <AlertBadge severity="blue">3 active</AlertBadge>
      </div>
      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.title} recommendation={recommendation} />
        ))}
      </div>
    </section>
  );
}

function AlertsPanel() {
  return (
    <section className="bp-card rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-950">Alerts</h2>
          <p className="mt-1 text-sm text-slate-500">Signals requiring leadership attention</p>
        </div>
        <AlertBadge severity="red">1 urgent</AlertBadge>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.label} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-slate-950">{alert.label}</div>
                <div className="mt-1 text-sm text-slate-500">{alert.detail}</div>
              </div>
              <AlertBadge severity={alert.severity}>{alert.severity}</AlertBadge>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExecutiveOverview() {
  const kpis = useMemo(
    () => [
      { label: "Net production", value: "$224.7k", delta: "+8.4%", helper: "Pacing above weekly goal by $17.3k", severity: "green" as Severity },
      { label: "Schedule fill rate", value: "82%", delta: "-4.1%", helper: "Friday hygiene is the main drag", severity: "yellow" as Severity },
      { label: "Case acceptance", value: "73%", delta: "+5.8%", helper: "Restorative treatment plans improved", severity: "green" as Severity },
      { label: "Cancellation risk", value: "$31.2k", delta: "high", helper: "Unconfirmed visits within 72 hours", severity: "red" as Severity },
    ],
    [],
  );

  return (
    <main className="space-y-6 p-6 lg:p-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1.4fr]">
        <HealthScoreCard />
        <ProductionChart />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <UtilizationChart />
        <AlertsPanel />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <ProviderTable />
        <RecommendationsPanel />
      </div>
    </main>
  );
}

function PlaceholderPage({ active }: { active: PageKey }) {
  return (
    <main className="p-6 lg:p-8">
      <section className="bp-card min-h-[520px] rounded-lg p-8">
        <div className="max-w-3xl">
          <AlertBadge severity="blue">Prototype page</AlertBadge>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950">{active}</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This section is wired into the Bright Path app shell and ready for detailed workflow design. The executive overview contains
            the fully designed dashboard experience with mock practice intelligence, charts, cards, recommendations, and alerts.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Data model", "Rules", "Drilldowns"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-extrabold text-slate-950">{item}</div>
                <div className="mt-2 text-sm leading-6 text-slate-500">Placeholder surface for the next build phase.</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [active, setActive] = useState<PageKey>("Executive Overview");

  return (
    <div className="min-h-screen bg-canvas lg:pl-72">
      <Sidebar active={active} onSelect={setActive} />
      <div className="min-h-screen">
        <Header active={active} />
        {active === "Executive Overview" ? <ExecutiveOverview /> : <PlaceholderPage active={active} />}
      </div>
    </div>
  );
}
