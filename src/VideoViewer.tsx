import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import type { GrandPrix, Session, SessionType } from "./types";
import { resolveSessionVideo, broadcastAspect } from "./scraper";
import { Reveal, Frame, ArrowUpRight, Play, Chevron, Spinner } from "./ui";

const TYPE_ORDER: SessionType[] = [
    "practice",
    "qualifying",
    "sprint",
    "race",
    "extra",
];
const TYPE_LABEL: Record<SessionType, string> = {
    practice: "Essais",
    qualifying: "Qualifs",
    sprint: "Sprint",
    race: "Course",
    extra: "Extras",
};

type Playing = { gp: GrandPrix; session: Session; video: string };

const VideoViewer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const year = String(location.state?.date || "");
    const ratio = broadcastAspect(year);
    const narrow = ratio === "4 / 3";
    const playerRef = useRef<HTMLDivElement>(null);

    const grandsPrix = useMemo<GrandPrix[]>(
        () => location.state?.grandsPrix || [],
        [location.state],
    );

    const [openKey, setOpenKey] = useState<string | null>(
        grandsPrix[0]?.key ?? null,
    );
    const [playing, setPlaying] = useState<Playing | null>(null);
    const [resolving, setResolving] = useState<string | null>(null);
    const [failed, setFailed] = useState<string | null>(null);

    const play = async (gp: GrandPrix, session: Session) => {
        setResolving(session.watchUrl);
        setFailed(null);
        const video = await resolveSessionVideo(session.watchUrl);
        setResolving(null);
        if (!video) {
            setFailed(session.watchUrl);
            return;
        }
        setPlaying({ gp, session, video });
        requestAnimationFrame(() =>
            playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        );
    };

    if (grandsPrix.length === 0) {
        return (
            <main className="grid min-h-[100dvh] place-items-center px-6 text-center">
                <div>
                    <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-red">
                        Drapeau rouge
                    </p>
                    <h1 className="display text-[clamp(3rem,12vw,8rem)] text-ink">
                        Aucun contenu
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
                            {String(grandsPrix.length).padStart(2, "0")}
                        </span>
                        Grand{grandsPrix.length > 1 ? "s" : ""} Prix
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
                {playing && (
                    <Reveal className="mt-12">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <h2 className="flex min-w-0 items-baseline gap-4">
                                <span className="display tabular shrink-0 text-3xl text-red sm:text-4xl">
                                    R{String(playing.gp.round).padStart(2, "0")}
                                </span>
                                <span className="min-w-0">
                                    <span className="display block truncate text-2xl text-ink sm:text-4xl">
                                        {playing.gp.name}
                                    </span>
                                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-red">
                                        {playing.session.label}
                                    </span>
                                </span>
                            </h2>
                            <button
                                onClick={() => setPlaying(null)}
                                aria-label="Fermer le lecteur"
                                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-surface hover:text-ink"
                            >
                                <ArrowUpRight className="h-4 w-4 rotate-45" />
                            </button>
                        </div>
                        <div className={narrow ? "mx-auto max-w-[52rem]" : ""}>
                            <Frame ratio={ratio}>
                                <iframe
                                    src={playing.video}
                                    title={`${playing.gp.name} — ${playing.session.label}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    sandbox="allow-same-origin allow-scripts"
                                    allowFullScreen
                                    scrolling="no"
                                    className="absolute inset-0 h-full w-full border-0"
                                />
                            </Frame>
                        </div>
                    </Reveal>
                )}
            </div>

            {/* ── Grand Prix index (calendar) ─────────────────────── */}
            <section className="mt-16">
                <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    <span>Calendrier</span>
                    <span>Essais · Qualifs · Sprint · Course</span>
                </div>

                <ul className="border-t border-line">
                    {grandsPrix.map((gp, i) => {
                        const open = openKey === gp.key;
                        return (
                            <Reveal as="li" key={gp.key} delay={Math.min(i * 30, 300)}>
                                <button
                                    onClick={() => setOpenKey(open ? null : gp.key)}
                                    aria-expanded={open}
                                    className={`group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line py-6 text-left transition-colors duration-300 sm:gap-8 sm:py-7 ${
                                        open ? "bg-red/[0.06]" : "hover:bg-surface"
                                    }`}
                                >
                                    <span
                                        className={`display tabular pl-1 text-4xl transition-colors sm:pl-4 sm:text-6xl ${
                                            open
                                                ? "text-red"
                                                : "text-muted group-hover:text-ink"
                                        }`}
                                    >
                                        {String(gp.round).padStart(2, "0")}
                                    </span>

                                    <span className="min-w-0">
                                        <span className="display block truncate text-2xl text-ink sm:text-4xl">
                                            {gp.name}
                                        </span>
                                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:text-[11px]">
                                            {gp.sessions.length} session
                                            {gp.sessions.length > 1 ? "s" : ""}
                                            {gp.sessions.some((s) => s.type === "sprint")
                                                ? " · Sprint"
                                                : ""}
                                        </span>
                                    </span>

                                    <span
                                        className={`mr-1 grid h-11 w-11 shrink-0 place-items-center rounded-full transition-all duration-300 sm:mr-4 sm:h-12 sm:w-12 ${
                                            open
                                                ? "bg-red text-white"
                                                : "bg-surface2 text-ink group-hover:bg-red group-hover:text-white"
                                        }`}
                                    >
                                        <Chevron
                                            className={`h-5 w-5 transition-transform duration-300 ${
                                                open ? "rotate-180" : ""
                                            }`}
                                        />
                                    </span>
                                </button>

                                {open && (
                                    <div className="border-b border-line bg-surface/40 px-1 py-6 sm:px-4">
                                        <SessionGroups
                                            gp={gp}
                                            playing={playing}
                                            resolving={resolving}
                                            failed={failed}
                                            onPlay={play}
                                        />
                                    </div>
                                )}
                            </Reveal>
                        );
                    })}
                </ul>
            </section>
        </main>
    );
};

/* ── Grouped session chips for one Grand Prix ─────────────────── */
const SessionGroups = ({
    gp,
    playing,
    resolving,
    failed,
    onPlay,
}: {
    gp: GrandPrix;
    playing: Playing | null;
    resolving: string | null;
    failed: string | null;
    onPlay: (gp: GrandPrix, session: Session) => void;
}) => (
    <div className="flex flex-col gap-5">
        {TYPE_ORDER.map((type) => {
            const items = gp.sessions.filter((s) => s.type === type);
            if (items.length === 0) return null;
            return (
                <div
                    key={type}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-[7rem_1fr] sm:items-start"
                >
                    <span className="pt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                        {TYPE_LABEL[type]}
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {items.map((session) => {
                            const isPlaying =
                                playing?.session.watchUrl === session.watchUrl;
                            const isResolving = resolving === session.watchUrl;
                            const isFailed = failed === session.watchUrl;
                            const race = type === "race";
                            return (
                                <button
                                    key={session.watchUrl}
                                    onClick={() => onPlay(gp, session)}
                                    disabled={isResolving}
                                    className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${
                                        isPlaying
                                            ? "border-red bg-red text-white"
                                            : isFailed
                                              ? "border-red/50 text-red"
                                              : race
                                                ? "border-red/40 bg-red/10 text-ink hover:bg-red hover:text-white"
                                                : "border-line text-ink hover:bg-ink hover:text-bg"
                                    }`}
                                >
                                    {isResolving ? (
                                        <Spinner className="h-3.5 w-3.5" />
                                    ) : (
                                        <Play className="h-3 w-3 translate-x-px" />
                                    )}
                                    {session.label}
                                    {isFailed && (
                                        <span className="font-mono text-[10px] uppercase">
                                            indispo
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        })}
    </div>
);

export default VideoViewer;
