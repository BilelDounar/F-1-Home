import { useState } from "react";
import axios from "axios";
import * as cheerio from "cheerio";
import { useNavigate } from "react-router-dom";

const MainScraper = () => {
    const [year, setYear] = useState("2025");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchLinks = async () => {
        setLoading(true);
        const baseUrl = `https://overtakefans.com/f1-race-archive/index.php?year=${year}`;
        try {
            const response = await axios.get(baseUrl);
            const $ = cheerio.load(response.data);
            const raceLinks: { name: string; url: string }[] = [];

            $("a").each((_, el) => {
                const href = $(el).attr("href") || "";
                if (
                    href.startsWith("watch/index.php?race=") &&
                    href.includes(`${year}`) &&
                    href.includes("formula-1-race") &&
                    !href.includes("source=official-result-main")
                ) {
                    const fullLink = `https://overtakefans.com/f1-race-archive/${href}`;
                    const name = decodeURIComponent(
                        href.split("race=")[1].replace(/-/g, " ").replace("formula 1 race", "").trim()
                    );
                    raceLinks.push({ name, url: fullLink });
                }
            });

            const finalLinks: { name: string; video: string }[] = [];

            for (const { name, url } of raceLinks) {
                try {
                    const res = await axios.get(url);
                    const $race = cheerio.load(res.data);
                    const iframeSrc = $race("iframe").attr("src");
                    if (iframeSrc) {
                        finalLinks.push({ name, video: iframeSrc });
                    }
                } catch (err) {
                    console.error(`Erreur chargement ${url}`);
                }
            }

            navigate("/lecteur", { state: { videos: finalLinks, date: year } });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" min-h-screen mx-auto max-w-[1300px] mt-8">
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold text-center mb-6">Actuellement en direct</h1>
                <iframe src={"https://hakunamatata5.org/sky-main-event/clean.html"}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-same-origin allow-scripts"
                    className="w-full h-[502px] border border-gray-300 rounded-lg overflow-hidden"
                > </iframe>
            </div>
            <div className="w-full mx-auto bg-base-200 mt-8 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Consulter les archives F1</h1>

                <div className="flex flex-col justify-center gap-4 mb-6">
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="select select-primary w-full"
                    >
                        {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={fetchLinks}
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <span>⏳ Chargement...</span>
                        ) : (
                            <span> Voir les vidéos</span>
                        )}
                    </button>
                </div>

                {loading && (
                    <div className="text-center">
                        <p>⏳ Chargement des vidéos, merci de patienter...</p>
                    </div>
                )}
            </div>


        </div>
    );
};

export default MainScraper;
