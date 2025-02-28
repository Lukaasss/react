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
        <div className="bg-black text-white h-screen flex flex-col items-center justify-center p-12 relative">
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 right-6 text-gray-500 text-3xl"
            >
                ✖
            </button>
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg flex flex-row w-[700px] h-[400px]">
                <img src={movie.Poster} alt={movie.Title} className="w-52 rounded-lg" />

                );
};

                export default MovieDetails;
