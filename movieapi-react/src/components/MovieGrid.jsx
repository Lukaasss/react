import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";

const MovieGrid = ({ movies }) => {
    const navigate = useNavigate();
    const displayedMovies = movies.slice(0, 10); // Nur 10 Filme anzeigen

    return (
        <div className="grid grid-cols-5 grid-rows-2 gap-6 p-8 w-full h-screen">
            {displayedMovies.map((movie) => (
                <div className="w-full h-full flex justify-center items-center">
                    <Card
                        key={movie.imdbID}
                        name={movie.Title}
                        imageUri={movie.Poster}
                        title={movie.Year}
                        onClick={() => navigate(`/info/${movie.imdbID}`)}
                    />
                </div>
            ))}
            { }
        </div>
    );
};

export default MovieGrid;
