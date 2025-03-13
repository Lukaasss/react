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
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const fetchMovies = async (search, page = 1) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${search}&page=${page}&apikey=5238ec27`
      );
      const data = await response.json();
      if (data.Response === "True" && data.Search) {
        setMovies(data.Search);
        setTotalPages(Math.max(1, Math.ceil(data.totalResults / 10)));
      } else {
        setMovies([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm, currentPage);
  }, [currentPage, searchTerm]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} flex flex-col h-screen w-screen overflow-hidden`}>
        <Header
          onSearch={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          onPopularMovies={() => setSearchTerm("action")}
          toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex flex-col flex-grow justify-between h-full">
                {movies.length > 0 ? (
                  <MovieGrid
                    movies={movies}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
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
      </div>
    </BrowserRouter>
  );
};

export default App;
