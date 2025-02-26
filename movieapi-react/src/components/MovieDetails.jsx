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
            <div className="text-center">
                <h1 className="text-2xl font-bold">{movie.Title}</h1>
                <img src={movie.Poster} alt={movie.Title} className="my-4 w-64" />
                <p>{movie.Plot}</p>
                <p><strong>Genre:</strong> {movie.Genre}</p>
                <p><strong>Bewertung:</strong> {movie.imdbRating}</p>
            </div>
        </div>
    );
};

export default MovieDetails;
