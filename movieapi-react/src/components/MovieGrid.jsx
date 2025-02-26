import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";

const MovieGrid = ({ movies }) => {
    const navigate = useNavigate();
    const displayedMovies = movies.slice(0, 10);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-8 w-full h-full overflow-hidden">
            {displayedMovies.map((movie) => (
                <div className="w-full h-full flex justify-center items-center">
                    <Card
                        key={movie.imdbID}
                        name={movie.Title}
                        imageUri={movie.Poster}
                        onClick={() => navigate(`/info/${movie.imdbID}`)}
                    />
                </div>
            ))}
        </div>
    );
};

export default MovieGrid;