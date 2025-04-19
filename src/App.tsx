import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainScraper from "./MainScraper";
import VideoViewer from "./VideoViewer";
import './App.css';

const NotFound = () => (
  <div className="min-h-screen flex flex-col justify-center items-center text-center p-6">
    <h1 className="text-5xl font-bold mb-4">404</h1>
    <p className="text-lg text-gray-600 mb-6">Oups… Cette page n’existe pas.</p>
    <a href="/" className="btn btn-primary">Retour à l’accueil</a>
  </div>
);

function App() {
  return (
    <>
      <div className="navbar bg-[#F9F9F9] flex justify-center items-center">
        <a href="/" className="flex items-center">
          <img src="F1Home.png" className="w-24 sm:w-28" alt="Logo" />
        </a>
      </div>

      <Router>
        <Routes>
          <Route path="/" element={<MainScraper />} />
          <Route path="/lecteur" element={<VideoViewer />} />
          <Route path="*" element={<NotFound />} /> {/* Route 404 */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
