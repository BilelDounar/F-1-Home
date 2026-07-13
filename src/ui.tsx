import {
    useEffect,
    useRef,
    useState,
    type ReactNode,
    type SVGProps,
} from "react";

/* ── Scroll-reveal wrapper ────────────────────────────────────
   Fades/blurs children up once they enter the viewport. Honours
   prefers-reduced-motion by rendering statically. */
export const Reveal = ({
    children,
    delay = 0,
    as: Tag = "div",
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    as?: "div" | "section" | "li" | "header";
    className?: string;
}) => {
    const ref = useRef<HTMLElement | null>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setShown(true);
            return;
        }
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true);
                    io.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <Tag
            ref={ref as never}
            style={{ transitionDelay: `${delay}ms` }}
            className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
        >
            {children}
        </Tag>
    );
};

/* ── Infinite marquee ticker ─────────────────────────────────── */
export const Marquee = ({
    items,
    className = "",
}: {
    items: string[];
    className?: string;
}) => {
    const row = (
        <div className="marquee-track" aria-hidden="true">
            {[...items, ...items].map((item, i) => (
                <span key={i} className="flex items-center whitespace-nowrap">
                    <span className="px-6 display text-inherit">{item}</span>
                    <Spark className="h-3 w-3 text-red shrink-0" />
                </span>
            ))}
        </div>
    );
    return (
        <div className={`marquee ${className}`}>
            {row}
            {row}
        </div>
    );
};

/* ── Fixed film-grain overlay ────────────────────────────────── */
export const Grain = () => <div className="grain" aria-hidden="true" />;

/* ── Double-bezel frame (machined "hardware" enclosure) ──────── */
export const Frame = ({
    children,
    className = "",
    live = false,
}: {
    children: ReactNode;
    className?: string;
    live?: boolean;
}) => (
    <div
        className={`relative rounded-[1.75rem] bg-white/[0.04] p-1.5 ring-1 ring-white/10 ${className}`}
    >
        <div className="relative overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
            {children}
        </div>
        {live && (
            <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-red px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                En direct
            </span>
        )}
    </div>
);

/* ── Ultra-thin line icons ───────────────────────────────────── */
export const ArrowUpRight = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M7 17 17 7M8 7h9v9" />
    </svg>
);

export const Play = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
);

export const Spark = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2 14 10 22 12 14 14 12 22 10 14 2 12 10 10Z" />
    </svg>
);

export const Chevron = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

/* Small inline loading spinner. */
export const Spinner = ({ className = "" }: { className?: string }) => (
    <span
        className={`inline-block animate-spin rounded-full border-2 border-current/30 border-t-current ${className}`}
    />
);
