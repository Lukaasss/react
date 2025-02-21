import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MovieGrid from "./components/MovieGrid";
import Pagination from "./components/Pagination";
import MovieDetails from "./components/MovieDetails";
import Card from "./components/Card";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("action");
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (search, page = 1) => {
    setLoading(true);
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
      console.error("Error fetching movies:", error);
      setMovies([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies(searchTerm, currentPage);
  }, [currentPage, searchTerm]);

  return (
    <BrowserRouter>
      <Header
        onSearch={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
        onPopularMovies={() => setSearchTerm("popular")}
      />
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col min-h-screen bg-black text-white">
              {loading ? (
                <div className="text-center mt-8 text-gray-400">Loading...</div>
              ) : movies.length > 0 ? (
                <>
                  <MovieGrid movies={movies} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <div className="text-center mt-8 text-gray-400">
                  No movies found.
                </div>
              )}
            </div>
          }
        />
        <Route path="/info/:id" element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
