import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import MovieGrid from "./components/MovieGrid";
import Pagination from "./components/Pagination";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMovies = async (search, page = 1) => {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${search}&page=${page}&apikey=5238ec27`
    );
    const data = await response.json();
    if (data.Response === "True") {
      setMovies(data.Search);
      setTotalPages(Math.ceil(data.totalResults / 10));
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm || "action", currentPage);
  }, [currentPage, searchTerm]);

  return (
    <div className="bg-black text-white min-h-screen">
      <Header
        onSearch={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
        onPopularMovies={() => setSearchTerm("")}
      />
      <MovieGrid movies={movies} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default App;