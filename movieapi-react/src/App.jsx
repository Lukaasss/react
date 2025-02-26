import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MovieGrid from "./components/MovieGrid";
import Pagination from "./components/Pagination";
import MovieDetails from "./components/MovieDetails";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("action");

  const fetchMovies = async (search, page = 1) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${search}&page=${page}&apikey=5238ec27`
      );
      const data = await response.json();
      if (data.Response === "True" && data.Search) {
        setMovies(data.Search);
        setTotalPages(Math.ceil(data.totalResults / 10));
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Filme:", error);
      setMovies([]);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm, currentPage);
  }, [currentPage, searchTerm]);

  return (
    <BrowserRouter>
      <div className="bg-black text-white flex flex-col h-screen w-screen overflow-hidden">
        <Header
          onSearch={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          onPopularMovies={() => setSearchTerm("action")}
        />
        <Routes>
          <Route path="/" element={
            movies.length > 0 ? (
              <div className="flex flex-col flex-grow justify-between h-full">
                <MovieGrid movies={movies} />
                <div className="bg-black flex justify-center items-center h-16">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center mt-8 text-gray-400">Keine Filme gefunden.</div>
            )
          } />
          <Route path="/info/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
