import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainScraper from "./MainScraper";
import VideoViewer from "./VideoViewer";
import { Grain, Marquee, ArrowUpRight } from "./ui";

const Navbar = () => (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5">
        <nav className="flex w-full max-w-[1320px] items-center justify-between rounded-full border border-line bg-black/60 px-3 py-2 pl-4 backdrop-blur-xl">
            <Link to="/" className="group flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center bg-red text-white">
                    <span className="display text-lg leading-none">F1</span>
                </span>
                <span className="display text-lg tracking-tight">Home</span>
            </Link>
            <div className="flex items-center gap-2">
                <span className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-muted sm:inline-flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-red" />
                    Archive · Live
                </span>
                <a
                    href="#archives"
                    className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-[13px] font-semibold text-bg transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-95"
                >
                    Archives
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
            </div>
        </nav>
    </header>
);

const Footer = () => (
    <footer className="mt-24 border-t border-line">
        <div className="checker h-3 w-full opacity-40" aria-hidden="true" />
        <Marquee
            items={["Formula 1", "Archive", "En direct", "Grand Prix", "Replays"]}
            className="py-6 text-4xl text-ink/80 sm:text-6xl"
        />
        <div className="checker h-3 w-full opacity-40" aria-hidden="true" />
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-3 px-5 py-8 text-xs uppercase tracking-[0.16em] text-muted sm:flex-row">
            <span>© {new Date().getFullYear()} F1 Home</span>
            <span>Archives &amp; direct — fan project</span>
        </div>
    </footer>
);

const NotFound = () => (
    <main className="grid min-h-[100dvh] place-items-center px-6 text-center">
        <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-red">
                Hors piste
            </p>
            <h1 className="display text-[clamp(5rem,22vw,14rem)] text-ink">404</h1>
            <p className="mb-8 text-muted">Cette page n'existe pas.</p>
            <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-red px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white"
            >
                Retour à l'accueil
                <ArrowUpRight className="h-4 w-4" />
            </Link>
        </div>
    </main>
);

function App() {
    return (
        <Router>
            <Grain />
            <Navbar />
            <Routes>
                <Route path="/" element={<MainScraper />} />
                <Route path="/lecteur" element={<VideoViewer />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
