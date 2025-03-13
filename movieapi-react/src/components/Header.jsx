import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importiere useNavigate
import logo from "../assets/T2.webp"; // Importiere das Bild

const Header = ({ onSearch, onPopularMovies, toggleTheme }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate(); // useNavigate Hook hier

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    const handlePopularMovies = () => {
        onSearch("action"); // Setze den Suchbegriff auf "action"
        navigate("/"); // Navigiere zur Hauptseite
    };

    return (
        <div className="border-b border-gray-700 bg-gray-900 w-full h-28 p-8 flex items-center justify-between">
            <img src={logo} alt="Logo" className="w-20" />
            <button
                onClick={handlePopularMovies} // Verwende die angepasste Funktion
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
            <button
                onClick={toggleTheme}
                className="bg-gray-700 text-white px-4 py-2 rounded"
            >
                🌙/☀️
            </button>
        </div>
    );
};

export default Header;
