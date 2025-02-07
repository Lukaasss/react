import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(
                    `https://www.omdbapi.com/?i=${id}&apikey=5238ec27`
                );
                const data = await response.json();
                if (data.Response === "True") {
                    setMovie(data);
                } else {
                    setMovie(null);
                }
            } catch (error) {
                console.error("Fehler beim Abrufen der Filmdetails:", error);
                setMovie(null);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (!movie) return <div className="text-white text-center mt-8">Lädt...</div>;

    return (
        <div className="bg-black text-white h-screen overflow-hidden flex flex-col items-center justify-center p-8">
            <button
                onClick={() => navigate("/")}
                className="absolute top-4 right-4 text-gray-500 text-2xl"
            >
                X
            </button>
            { }
        </div>
    );
};

export default MovieDetails;
