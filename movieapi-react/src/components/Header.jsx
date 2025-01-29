import React from "react";

export default function Header({ setSearchTerm, setCurrentPage }) {
    return (
        <header className="flex justify-between items-center p-4 bg-gray-900">
            <img src="./assets/T2.webp" alt="" className="w-20" />
            <button
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                }}
            >
                Beliebte Filme
            </button>
        </header>
    );
}
