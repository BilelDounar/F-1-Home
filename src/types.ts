/** Category of a session within a Grand Prix weekend. */
export type SessionType =
    | "practice"
    | "qualifying"
    | "sprint"
    | "race"
    | "extra";

/** A single watchable session (resolved to its video lazily, on demand). */
export type Session = {
    /** Readable label, e.g. "Essais 1", "Qualifications", "Course". */
    label: string;
    type: SessionType;
    /** Archive page URL — resolved to an embed only when the user plays it. */
    watchUrl: string;
    /** Sort weight inside a weekend (practice → quali → sprint → race → extra). */
    order: number;
};

/** A Grand Prix and every session available for it in the archive. */
export type GrandPrix = {
    /** Normalised venue key used for grouping. */
    key: string;
    /** Readable name, e.g. "Monaco Grand Prix". */
    name: string;
    /** Chronological position within the season (1-based). */
    round: number;
    sessions: Session[];
};
