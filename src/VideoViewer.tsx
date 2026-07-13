import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import type { RaceVideo } from "./types";

const VideoViewer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const year = String(location.state?.date || "");

    // Display the season in chronological order (by race round), with a stable
    // alphabetical fallback when a round is missing.
    const races = useMemo(() => {
        const videos: RaceVideo[] = location.state?.videos || [];
        return [...videos].sort(
            (a, b) => (a.round ?? 0) - (b.round ?? 0) || a.name.localeCompare(b.name),
        );
    }, [location.state]);

    const [active, setActive] = useState<RaceVideo | null>(null);

    if (races.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
                <p className="text-2xl mb-4">🛑 Aucune vidéo trouvée pour cette saison.</p>
                <button onClick={() => navigate("/")} className="btn btn-primary">
                    Retour à l'accueil
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6">
            <div className="mx-auto max-w-[1300px]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold">
                            Saison <span className="text-primary">{year}</span>
                        </h1>
                        <p className="text-base-content/60">
                            {races.length} course{races.length > 1 ? "s" : ""} disponible
                            {races.length > 1 ? "s" : ""}
                        </p>
                    </div>
                    <button onClick={() => navigate("/")} className="btn btn-outline btn-primary">
                        ← Retour à l'accueil
                    </button>
                </div>

                {/* Featured player */}
                {active && (
                    <div className="bg-base-200 rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-3">
                                <span className="badge badge-primary badge-lg">
                                    Manche {active.round}
                                </span>
                                {active.name}
                            </h2>
                            <button
                                onClick={() => setActive(null)}
                                className="btn btn-sm btn-ghost"
                                aria-label="Fermer le lecteur"
                            >
                                ✕
                            </button>
                        </div>
                        <iframe
                            src={active.video}
                            title={active.name}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            sandbox="allow-same-origin allow-scripts"
                            allowFullScreen
                            className="w-full aspect-video border border-base-300 rounded-xl overflow-hidden"
                        />
                    </div>
                )}

                {/* Race grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {races.map((race) => {
                        const isActive = active?.video === race.video;
                        return (
                            <button
                                key={race.video}
                                onClick={() => setActive(race)}
                                className={`group text-left rounded-xl border transition shadow-sm hover:shadow-lg hover:-translate-y-0.5 ${
                                    isActive
                                        ? "border-primary ring-2 ring-primary bg-primary/5"
                                        : "border-base-300 bg-base-200 hover:border-primary/50"
                                }`}
                            >
                                <div className="aspect-video flex items-center justify-center bg-neutral text-neutral-content rounded-t-xl">
                                    <span className="text-4xl transition-transform group-hover:scale-125">
                                        ▶️
                                    </span>
                                </div>
                                <div className="p-4">
                                    <span className="badge badge-outline badge-sm mb-2">
                                        Manche {race.round}
                                    </span>
                                    <h3 className="font-semibold leading-snug">{race.name}</h3>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default VideoViewer;
