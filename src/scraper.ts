import axios from "axios";
import * as cheerio from "cheerio";
import type { GrandPrix, Session, SessionType } from "./types";

const ARCHIVE_BASE = "https://overtakefans.com/f1-race-archive";

/* ── Venue normalisation ──────────────────────────────────────
   The archive labels a few events under two tokens (venue vs.
   country). Merge them so a Grand Prix isn't split in two. */
const VENUE_ALIAS: Record<string, string> = {
    imola: "emilia-romagna",
    monza: "italian",
    "great-britain": "british",
    "united-kingdom": "british",
    belgium: "belgian",
    netherlands: "dutch",
    brazil: "sao-paulo",
    "so-paulo": "sao-paulo",
    "s-o-paulo": "sao-paulo",
    mexico: "mexico-city",
};

/* A handful of display names that don't title-case cleanly. */
const VENUE_DISPLAY: Record<string, string> = {
    "sao-paulo": "São Paulo",
    "emilia-romagna": "Émilie-Romagne",
    "abu-dhabi": "Abu Dhabi",
    "mexico-city": "Mexico City",
    "las-vegas": "Las Vegas",
};

const titleCase = (slug: string): string =>
    slug
        .split("-")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

const venueName = (key: string): string =>
    `${VENUE_DISPLAY[key] ?? titleCase(key)} Grand Prix`;

/* ── Session classification ───────────────────────────────────
   Handles modern ("formula-1-practice-1") and legacy ("practice-1",
   "warm-up") naming, plus sprint and analysis/show content. */
const classifySession = (
    raw: string,
): { type: SessionType; label: string; order: number } => {
    const s = raw.replace(/^formula-1-/, "").replace(/^\d{4}-/, "");

    if (s === "warm-up") return { type: "practice", label: "Warm-Up", order: 19 };

    const practice = s.match(/^practice-?(\d)?$/);
    if (practice) {
        const n = practice[1];
        return {
            type: "practice",
            label: n ? `Essais ${n}` : "Essais libres",
            order: 10 + Number(n || 0),
        };
    }

    if (/sprint-(qualifying|shootout)/.test(s))
        return {
            type: "sprint",
            label: s.includes("shootout") ? "Sprint Shootout" : "Qualifs Sprint",
            order: 30,
        };
    if (s === "sprint") return { type: "sprint", label: "Sprint", order: 31 };

    const quali = s.match(/^qualifying-?(\d)?$/);
    if (quali) {
        return {
            type: "qualifying",
            label: quali[1] ? `Qualifs ${quali[1]}` : "Qualifications",
            order: 20,
        };
    }

    if (s === "race") return { type: "race", label: "Course", order: 40 };

    return { type: "extra", label: titleCase(s), order: 50 };
};

/** Full list of seasons offered by the archive (newest first). */
export const fetchAvailableYears = async (): Promise<number[]> => {
    try {
        const current = new Date().getFullYear();
        const { data } = await axios.get(`${ARCHIVE_BASE}/index.php?year=${current}`);
        const years = new Set<number>();
        for (const m of String(data).matchAll(/index\.php\?year=(\d{4})/g)) {
            years.add(Number(m[1]));
        }
        if (years.size > 0) return [...years].sort((a, b) => b - a);
    } catch {
        console.error("Impossible de récupérer la liste des saisons");
    }
    return staticYears();
};

/**
 * Native aspect ratio of a season's broadcast footage. The F1 world
 * feed moved to 16:9 widescreen in 2005; earlier seasons are 4:3.
 * Used to size the player so the video fits edge-to-edge.
 */
export const broadcastAspect = (year: string | number): string =>
    Number(year) >= 2005 ? "16 / 9" : "4 / 3";

/** Fallback range matching what the archive advertises (1978 → today). */
export const staticYears = (start = 1978): number[] => {
    const current = new Date().getFullYear();
    const years: number[] = [];
    for (let y = current; y >= start; y--) years.push(y);
    return years;
};

/**
 * Scrape a whole season into Grands Prix, each with every available
 * session. Only the index page is fetched (one request) — session videos
 * are resolved lazily via {@link resolveSessionVideo} when played, which
 * keeps a 300+ session season instant to load.
 */
export const scrapeSeason = async (
    year: string | number,
): Promise<GrandPrix[]> => {
    const { data } = await axios.get(`${ARCHIVE_BASE}/index.php?year=${year}`);
    const $ = cheerio.load(data);

    const groups = new Map<string, GrandPrix>();
    const seen = new Set<string>();
    let appearance = 0;

    $("a").each((_, el) => {
        const href = $(el).attr("href") || "";
        if (!href.startsWith("watch/index.php?race=")) return;
        if (href.includes("source=official-result-main")) return;

        const slug = decodeURIComponent(href.split("race=")[1]);
        if (!slug.startsWith(`${year}-`) || seen.has(slug)) return;
        seen.add(slug);

        // {year}-{venue}-grand-prix{-session}
        const body = slug.slice(`${year}-`.length);
        const marker = body.indexOf("-grand-prix");
        if (marker === -1) return;

        const rawVenue = body.slice(0, marker);
        const key = VENUE_ALIAS[rawVenue] ?? rawVenue;
        const sessionRaw = body.slice(marker + "-grand-prix".length).replace(/^-/, "");
        if (!sessionRaw) return;

        const { type, label, order } = classifySession(sessionRaw);
        const session: Session = {
            label,
            type,
            order,
            watchUrl: `${ARCHIVE_BASE}/watch/index.php?race=${slug}`,
        };

        let gp = groups.get(key);
        if (!gp) {
            gp = { key, name: venueName(key), round: ++appearance, sessions: [] };
            groups.set(key, gp);
        }
        gp.sessions.push(session);
    });

    return [...groups.values()].map((gp) => ({
        ...gp,
        sessions: gp.sessions.sort(
            (a, b) => a.order - b.order || a.label.localeCompare(b.label),
        ),
    }));
};

/** Resolve a single session's embedded video (called on play). */
export const resolveSessionVideo = async (
    watchUrl: string,
): Promise<string | null> => {
    try {
        const { data } = await axios.get(watchUrl);
        return cheerio.load(data)("iframe").attr("src") || null;
    } catch {
        console.error(`Erreur de chargement: ${watchUrl}`);
        return null;
    }
};
