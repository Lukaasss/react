import React, { useState } from "react";

const Header = ({ onSearch, onPopularMovies }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <div className="fixed border-b border-gray-700 bg-gray-900 w-full h-28 p-8 flex items-center justify-between">
            <img src="/images/T2.webp" alt="Logo" className="w-20" />
            <button
                onClick={onPopularMovies}
                className="bg-gray-700 text-white px-4 py-2 rounded"
            >
                Beliebte Filme
            </button>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Suchen"
                className="border p-4 bg-gray-700 text-white rounded"
            />
            { }
        </div>
    );
};

export default Header;
