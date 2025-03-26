import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import Pagination from "./Pagination";

const MovieGrid = ({ movies, currentPage, totalPages, onPageChange }) => {
    const navigate = useNavigate(); // Hook für die Navigation
    const displayedMovies = movies.slice(0, 10); // Zeigt maximal 10 Filme an

    return (
        <div className="flex flex-col items-center w-full h-full">
            {/* Grid-Layout für die Filmkarten */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-8 w-full h-full overflow-hidden">
                {displayedMovies.map((movie) => (
                    <div key={movie.imdbID} className="w-full h-full flex justify-center items-center">
                        <Card
                            name={movie.Title} // Filmname
                            imageUri={movie.Poster} // Filmcover
                            onClick={() => navigate(`/info/${movie.imdbID}`)} // Navigation zur Detailseite
                        />
                    </div>
                ))}
            </div>

            {/* Paginierung für Seitenwechsel */}
            <div className="mt-0 mb-0" style={{ position: "relative", top: "-25px" }}>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    );
};

export default MovieGrid;
