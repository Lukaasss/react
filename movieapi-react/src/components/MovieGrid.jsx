import React from "react";

export default function MovieGrid({ movies }) {
    return (
        <div className="bg-gray-900 min-h-screen grid grid-cols-6 gap-4 p-4">
            {movies && movies.length > 0 ? (
                movies.slice(0, 12).map((movie) => (
                    <div
                        key={movie.imdbID}
                        className="text-center flex flex-col justify-between h-80 bg-gray-800 rounded-lg shadow-md"
                    >
                        <img
                            src={movie.Poster}
                            alt={movie.Title}
                            className="w-full h-full object-cover rounded-t-lg"
                        />
                        <p className="text-white mt-2">{movie.Title}</p>
                    </div>
                ))
            ) : (
                <p className="text-white">Keine Filme gefunden</p>
            )}
        </div>
    );
}
