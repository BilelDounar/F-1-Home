import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { availableYears, scrapeSeason, type ScrapeProgress } from "./scraper";

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
        <div className="min-h-screen mx-auto max-w-[1300px] px-4 py-8">
            {/* Live broadcast */}
            <section className="flex flex-col items-center">
                <div className="flex items-center gap-3 mb-6">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-error" />
                    </span>
                    <h1 className="text-3xl font-bold text-center">Actuellement en direct</h1>
                </div>
                <iframe
                    src="https://hakunamatata5.org/sky-main-event/clean.html"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-same-origin allow-scripts"
                    className="w-full aspect-video max-h-[502px] border border-base-300 rounded-xl shadow-lg overflow-hidden"
                />
            </section>

            {/* Archive selector */}
            <section className="w-full mx-auto bg-base-200 mt-10 p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-2">Consulter les archives F1</h2>
                <p className="text-center text-base-content/60 mb-6">
                    Sélectionnez une saison pour revoir toutes les courses de l'année.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-2">
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="select select-primary sm:w-48"
                        disabled={loading}
                        aria-label="Choisir une saison"
                    >
                        {YEARS.map((y) => (
                            <option key={y} value={y}>
                                Saison {y}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={fetchLinks}
                        className="btn btn-primary sm:flex-1"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm" />
                                Chargement…
                            </>
                        ) : (
                            "🎬 Voir les vidéos"
                        )}
                    </button>
                </div>

                {loading && (
                    <div className="mt-6 text-center">
                        <progress
                            className="progress progress-primary w-full max-w-md"
                            value={percent}
                            max={100}
                        />
                        <p className="mt-2 text-sm text-base-content/70">
                            {progress && progress.total > 0
                                ? `Récupération des courses… ${progress.loaded}/${progress.total}`
                                : "Recherche des courses de la saison…"}
                        </p>
                    </div>
                )}

                {error && !loading && (
                    <div className="alert alert-error mt-6" role="alert">
                        <span>⚠️ {error}</span>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MainScraper;
