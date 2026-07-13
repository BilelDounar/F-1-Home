export type RaceVideo = {
    /** Readable Grand Prix name, e.g. "Monaco Grand Prix". */
    name: string;
    /** Embedded video (iframe) source URL. */
    video: string;
    /** Chronological position of the race within the season. */
    round: number;
};
