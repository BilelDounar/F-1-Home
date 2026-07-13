import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { availableYears, scrapeSeason, type ScrapeProgress } from "./scraper";
import { Reveal, Marquee, Frame, ArrowUpRight, Play } from "./ui";

const YEARS = availableYears();

const MainScraper = () => {
    const [year, setYear] = useState(String(YEARS[0]));
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<ScrapeProgress | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchLinks = async () => {
        setLoading(true);
        setError(null);
        setProgress(null);
        try {
            const videos = await scrapeSeason(year, setProgress);
            if (videos.length === 0) {
                setError(`Aucune vidéo trouvée pour la saison ${year}.`);
                return;
            }
            navigate("/lecteur", { state: { videos, date: year } });
        } catch (err) {
            console.error(err);
            setError("Impossible de récupérer les archives. Réessayez plus tard.");
        } finally {
            setLoading(false);
            setProgress(null);
        }
    };

    const percent =
        progress && progress.total > 0
            ? Math.round((progress.loaded / progress.total) * 100)
            : 0;

    return (
        <main className="overflow-clip">
            {/* ── HERO / LIVE ─────────────────────────────────────── */}
            <section className="mx-auto max-w-[1320px] px-5 pt-32 sm:pt-40">
                <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-muted">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
                        </span>
                        Signal en direct
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                        Season {YEARS[0]}
                    </span>
                </Reveal>

                <Reveal delay={80}>
                    <h1 className="mt-4 display text-[clamp(3.5rem,12vw,10rem)] text-ink">
                        Course <span className="text-red">en direct</span>
                    </h1>
                </Reveal>

                <div className="mt-10 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
                    <Reveal delay={140} className="lg:col-span-4">
                        <p className="max-w-md text-base leading-relaxed text-muted">
                            Le direct de la Formule 1 et l'intégralité des archives,
                            course par course, saison par saison. Sans jamais quitter
                            la page.
                        </p>
                        <div className="mt-8 flex gap-10 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                            <div>
                                <span className="display tabular block text-4xl text-ink">
                                    {YEARS.length}
                                </span>
                                saisons
                            </div>
                            <div>
                                <span className="display block text-4xl text-ink">24/7</span>
                                en direct
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={200} className="lg:col-span-8">
                        <Frame live>
                            <iframe
                                title="F1 — flux en direct"
                                src="https://hakunamatata5.org/sky-main-event/clean.html"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                sandbox="allow-same-origin allow-scripts"
                                className="aspect-video w-full"
                            />
                        </Frame>
                    </Reveal>
                </div>
            </section>

            {/* ── TICKER ──────────────────────────────────────────── */}
            <div className="mt-16 rule-t rule-b py-4 sm:mt-24">
                <Marquee
                    items={[
                        "Grand Prix",
                        "Qualifications",
                        "Sprint",
                        "Replays",
                        "Pole position",
                        "Podium",
                    ]}
                    className="text-3xl text-ink/70 sm:text-5xl"
                />
            </div>

            {/* ── ARCHIVE SELECTOR ────────────────────────────────── */}
            <section
                id="archives"
                className="mx-auto max-w-[1320px] scroll-mt-28 px-5 pt-20 sm:pt-28"
            >
                <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-red">
                            Les archives
                        </p>
                        <h2 className="display text-[clamp(2.75rem,9vw,7rem)] text-ink">
                            Choisir une
                            <br />
                            saison
                        </h2>
                    </div>
                    <p className="max-w-xs font-mono text-xs uppercase leading-relaxed tracking-[0.12em] text-muted">
                        {YEARS.length} saisons indexées — chaque course reliée à son
                        lecteur intégré.
                    </p>
                </Reveal>

                {/* Year tiles */}
                <Reveal delay={80}>
                    <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
                        {YEARS.map((y) => {
                            const selected = String(y) === year;
                            return (
                                <button
                                    key={y}
                                    onClick={() => setYear(String(y))}
                                    disabled={loading}
                                    aria-pressed={selected}
                                    className={`group relative flex items-baseline justify-between px-6 py-8 text-left transition-colors duration-300 ${
                                        selected
                                            ? "bg-red text-white"
                                            : "bg-bg text-ink hover:bg-surface"
                                    }`}
                                >
                                    <span className="display tabular text-5xl sm:text-6xl">
                                        {y}
                                    </span>
                                    <span
                                        className={`font-mono text-[11px] uppercase tracking-[0.16em] transition-opacity ${
                                            selected
                                                ? "opacity-90"
                                                : "opacity-40 group-hover:opacity-70"
                                        }`}
                                    >
                                        {selected ? "Sélectionnée" : "Saison"}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Reveal>

                {/* CTA + status */}
                <Reveal delay={120} className="mt-10">
                    <button
                        onClick={fetchLinks}
                        disabled={loading}
                        className="group inline-flex w-full items-center justify-between gap-4 rounded-full bg-ink py-3 pl-8 pr-3 text-bg transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-60 sm:w-auto"
                    >
                        <span className="text-base font-semibold uppercase tracking-[0.1em]">
                            {loading
                                ? "Chargement…"
                                : `Entrer dans la saison ${year}`}
                        </span>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-red text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                            {loading ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            ) : (
                                <Play className="h-4 w-4 translate-x-px" />
                            )}
                        </span>
                    </button>

                    {loading && (
                        <div className="mt-8 max-w-lg">
                            <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                                <span>
                                    {progress && progress.total > 0
                                        ? "Récupération des courses"
                                        : "Analyse de la saison"}
                                </span>
                                <span className="tabular">
                                    {progress && progress.total > 0
                                        ? `${progress.loaded}/${progress.total}`
                                        : "…"}
                                </span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-line">
                                <div
                                    className="h-full rounded-full bg-red transition-[width] duration-500"
                                    style={{ width: `${Math.max(percent, 6)}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {error && !loading && (
                        <div
                            role="alert"
                            className="mt-8 flex max-w-lg items-center gap-3 rounded-xl border border-red/40 bg-red/10 px-4 py-3 text-sm text-ink"
                        >
                            <ArrowUpRight className="h-4 w-4 shrink-0 rotate-90 text-red" />
                            {error}
                        </div>
                    )}
                </Reveal>
            </section>
        </main>
    );
};

export default MainScraper;
