import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import type { RaceVideo } from "./types";
import { Reveal, Frame, ArrowUpRight, Play } from "./ui";

const VideoViewer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const year = String(location.state?.date || "");
    const playerRef = useRef<HTMLDivElement>(null);

    // Season shown in chronological order (by round), stable name fallback.
    const races = useMemo(() => {
        const videos: RaceVideo[] = location.state?.videos || [];
        return [...videos].sort(
            (a, b) => (a.round ?? 0) - (b.round ?? 0) || a.name.localeCompare(b.name),
        );
    }, [location.state]);

    const [active, setActive] = useState<RaceVideo | null>(null);

    const select = (race: RaceVideo) => {
        setActive(race);
        requestAnimationFrame(() =>
            playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        );
    };

    if (races.length === 0) {
        return (
            <main className="grid min-h-[100dvh] place-items-center px-6 text-center">
                <div>
                    <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-red">
                        Drapeau rouge
                    </p>
                    <h1 className="display text-[clamp(3rem,12vw,8rem)] text-ink">
                        Aucune course
                    </h1>
                    <p className="mb-8 text-muted">
                        Cette saison ne contient aucune vidéo pour le moment.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-2 rounded-full bg-red px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white"
                    >
                        Retour à l'accueil
                        <ArrowUpRight className="h-4 w-4" />
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-[1320px] px-5 pb-10 pt-32 sm:pt-40">
            {/* ── Season header ───────────────────────────────────── */}
            <Reveal
                as="header"
                className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
            >
                <div>
                    <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-red">
                        Archive — saison
                    </p>
                    <h1 className="display text-[clamp(4rem,20vw,14rem)] leading-[0.8] text-ink">
                        {year}
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right font-mono text-xs uppercase tracking-[0.14em] text-muted">
                        <span className="block tabular text-3xl text-ink">
                            {String(races.length).padStart(2, "0")}
                        </span>
                        course{races.length > 1 ? "s" : ""}
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-surface"
                    >
                        <ArrowUpRight className="h-4 w-4 rotate-[225deg] transition-transform group-hover:-translate-x-0.5" />
                        Accueil
                    </button>
                </div>
            </Reveal>

            {/* ── Featured player ─────────────────────────────────── */}
            <div ref={playerRef} className="scroll-mt-28">
                {active && (
                    <Reveal className="mt-12">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <h2 className="flex items-baseline gap-4">
                                <span className="display tabular text-red text-3xl sm:text-4xl">
                                    R{String(active.round).padStart(2, "0")}
                                </span>
                                <span className="display text-2xl text-ink sm:text-4xl">
                                    {active.name}
                                </span>
                            </h2>
                            <button
                                onClick={() => setActive(null)}
                                aria-label="Fermer le lecteur"
                                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-surface hover:text-ink"
                            >
                                <ArrowUpRight className="h-4 w-4 rotate-45" />
                            </button>
                        </div>
                        <Frame>
                            <iframe
                                src={active.video}
                                title={active.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                sandbox="allow-same-origin allow-scripts"
                                allowFullScreen
                                className="aspect-video w-full"
                            />
                        </Frame>
                    </Reveal>
                )}
            </div>

            {/* ── Race index (calendar) ───────────────────────────── */}
            <section className="mt-16">
                <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    <span>Calendrier</span>
                    <span>Lecteur intégré</span>
                </div>

                <ul className="border-t border-line">
                    {races.map((race, i) => {
                        const isActive = active?.video === race.video;
                        return (
                            <Reveal as="li" key={race.video} delay={Math.min(i * 40, 320)}>
                                <button
                                    onClick={() => select(race)}
                                    className={`group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line py-6 text-left transition-colors duration-300 sm:gap-8 sm:py-7 ${
                                        isActive ? "bg-red/[0.06]" : "hover:bg-surface"
                                    }`}
                                >
                                    <span
                                        className={`display tabular pl-1 text-4xl transition-colors sm:pl-4 sm:text-6xl ${
                                            isActive
                                                ? "text-red"
                                                : "text-muted group-hover:text-ink"
                                        }`}
                                    >
                                        {String(race.round).padStart(2, "0")}
                                    </span>

                                    <span className="min-w-0">
                                        <span className="display block truncate text-2xl text-ink sm:text-4xl">
                                            {race.name}
                                        </span>
                                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:text-[11px]">
                                            {isActive
                                                ? "En lecture"
                                                : `Manche ${race.round} — Grand Prix`}
                                        </span>
                                    </span>

                                    <span
                                        className={`mr-1 grid h-11 w-11 shrink-0 place-items-center rounded-full transition-all duration-300 sm:mr-4 sm:h-14 sm:w-14 ${
                                            isActive
                                                ? "bg-red text-white"
                                                : "bg-surface2 text-ink group-hover:bg-red group-hover:text-white"
                                        }`}
                                    >
                                        <Play className="h-4 w-4 translate-x-px sm:h-5 sm:w-5" />
                                    </span>
                                </button>
                            </Reveal>
                        );
                    })}
                </ul>
            </section>
        </main>
    );
};

export default VideoViewer;
