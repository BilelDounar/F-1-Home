import axios from "axios";
import * as cheerio from "cheerio";
import type { RaceVideo } from "./types";

const ARCHIVE_BASE = "https://overtakefans.com/f1-race-archive";

/** Turn a raw archive slug into a clean, readable Grand Prix name. */
export const formatRaceName = (raw: string): string => {
    return decodeURIComponent(raw)
        .replace(/-/g, " ")
        .replace(/formula\s*1\s*race/gi, "")
        .replace(/^\d{4}\s*/, "") // strip the leading season year
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
        .join(" ")
        .trim();
};

export type ScrapeProgress = { loaded: number; total: number };

/** List of seasons currently available in the archive, newest first. */
export const availableYears = (start = 2018): number[] => {
    const current = new Date().getFullYear();
    const years: number[] = [];
    for (let y = current; y >= start; y--) years.push(y);
    return years;
};

/**
 * Scrape every race replay available for a given season.
 *
 * The season index page is fetched once to list the races, then each race
 * page is resolved in parallel to extract its embedded video. Progress is
 * reported through the optional callback so the UI can show a live counter.
 */
export const scrapeSeason = async (
    year: string | number,
    onProgress?: (progress: ScrapeProgress) => void,
): Promise<RaceVideo[]> => {
    const { data } = await axios.get(`${ARCHIVE_BASE}/index.php?year=${year}`);
    const $ = cheerio.load(data);

    // Collect the unique race pages listed for this season.
    const seen = new Set<string>();
    const races: { name: string; url: string }[] = [];

    $("a").each((_, el) => {
        const href = $(el).attr("href") || "";
        if (
            href.startsWith("watch/index.php?race=") &&
            href.includes(`${year}`) &&
            href.includes("formula-1-race") &&
            !href.includes("source=official-result-main")
        ) {
            const url = `${ARCHIVE_BASE}/${href}`;
            if (seen.has(url)) return;
            seen.add(url);
            races.push({ name: formatRaceName(href.split("race=")[1]), url });
        }
    });

    const total = races.length;
    let loaded = 0;
    onProgress?.({ loaded, total });

    // Resolve each race's embedded player in parallel — far faster than the
    // previous sequential loop, while preserving the archive's race order.
    const resolved = await Promise.all(
        races.map(async ({ name, url }, index): Promise<RaceVideo | null> => {
            try {
                const { data: raceHtml } = await axios.get(url);
                const video = cheerio.load(raceHtml)("iframe").attr("src");
                return video ? { name, video, round: index + 1 } : null;
            } catch {
                console.error(`Erreur de chargement: ${url}`);
                return null;
            } finally {
                loaded += 1;
                onProgress?.({ loaded, total });
            }
        }),
    );

    return resolved.filter((race): race is RaceVideo => race !== null);
};
