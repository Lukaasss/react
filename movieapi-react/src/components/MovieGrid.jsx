import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";

const MovieGrid = ({ movies, loading }) => {
    const navigate = useNavigate();
    const displayedMovies = movies.slice(0, 10);

    return (
        <div className="p-8 w-full min-h-screen bg-gray-900">
            {loading ? (
                <div className="text-white text-center text-xl mt-10">Lädt...</div>
            ) : displayedMovies.length > 0 ? (
                <div className="grid grid-cols-5 gap-6">
                    {displayedMovies.map((movie) => (
                        <div key={movie.imdbID} className="flex justify-center items-center">
                            <Card
                                name={movie.Title}
                                imageUri={movie.Poster}
                                title={movie.Year}
                                onClick={() => navigate(`/info/${movie.imdbID}`)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-gray-400 text-center mt-10">Keine Filme gefunden.</div>
            )}
        </div>
    );
};

export default MovieGrid;
