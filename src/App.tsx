import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainScraper from "./MainScraper";
import VideoViewer from "./VideoViewer";
import './App.css';

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
        </Routes>
      </Router>
    </>
  );
}

export default App;
