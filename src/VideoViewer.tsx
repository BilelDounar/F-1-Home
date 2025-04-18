import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

type VideoData = {
    name: string;
    video: string;
};

const formatName = (raw: string): string => {
    const nameWithoutYear = raw.replace(/^\d{4}\s*/, "");

    return nameWithoutYear
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};


const VideoViewer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const videos: VideoData[] = location.state?.videos || [];
    const date = String(location.state?.date || '[]');

    const [currentVideo, setCurrentVideo] = useState<string | null>(null);

    const handleShowVideo = (url: string) => {
        setCurrentVideo(url);
    };

    return (
        <div className="min-h-screen p-6">
            <div className="bg-base-200 p-8 rounded-lg shadow-lg mx-auto w-[1300px]">
                <h1 className="text-4xl font-bold text-center mb-6">Archive de l'année {date}</h1>

                <button
                    onClick={() => navigate("/")}
                    className="btn btn-primary w-full my-4"
                >
                    Retour à l'accueil
                </button>

                <div className="flex flex-row flex-wrap">
                    {videos.length === 0 ? (
                        <p className="text-center text-gray-600">🛑 Aucune vidéo trouvée.</p>
                    ) : (
                        videos.map(({ name, video }, idx) => (
                            <div
                                key={idx}
                                className={`mb-6 p-4 ${currentVideo === video ? 'w-full' : 'w-1/3'}`}
                            >
                                <h2 className="text-xl font-semibold mb-4">{formatName(name)}</h2>

                                {currentVideo === video ? (
                                    <iframe
                                        src={video}
                                        title={name}
                                        width="100%"
                                        height="502"
                                        allowFullScreen
                                        className="border border-gray-300 rounded-lg overflow-hidden"
                                    ></iframe>
                                ) : (
                                    <div
                                        onClick={() => handleShowVideo(video)}
                                        className="w-full h-72 bg-black text-white flex justify-center items-center cursor-pointer rounded-lg text-xl hover:bg-gray-800 transition"
                                    >
                                        ▶️ Voir la vidéo
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoViewer;
