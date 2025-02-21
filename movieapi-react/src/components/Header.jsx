import React, { useState } from "react";

const Header = ({ onSearch, onPopularMovies }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        if (searchTerm.trim()) {
            onSearch(searchTerm);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
            <img src="/images/T2.webp" alt="Logo" className="w-24" />
            <div className="flex items-center gap-4">
                <button
                    onClick={onPopularMovies}
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Beliebte Filme
                </button>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Suchen..."
                    className="border p-2 bg-gray-700 text-white rounded w-64"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                >
                    Suchen
                </button>
            </div>
        </div>
    );
};

export default Header;
