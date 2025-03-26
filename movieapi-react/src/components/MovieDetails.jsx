import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");  // Dark/Light Mode speichern

    // Movie Details laden
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=5238ec27`);
                const data = await response.json();
                if (data.Response === "True") {
                    setMovie(data);
                } else {
                    setMovie(null);
                }
            } catch (error) {
                console.error("Fehler beim Abrufen der Filmdetails:", error);
                setMovie(null);
            }
        };

        fetchMovieDetails();

        // Lade Kommentare aus localStorage
        const storedComments = JSON.parse(localStorage.getItem(id)) || [];
        setComments(storedComments);
    }, [id]);

    // Kommentar hinzufügen und speichern
    const handleAddComment = () => {
        if (comment.trim()) {
            const newComments = [...comments, { text: comment, rating }];
            setComments(newComments);
            localStorage.setItem(id, JSON.stringify(newComments));  // Kommentare speichern
            setComment("");
            setRating(0);
        }
    };

    // Kommentar löschen
    const handleDeleteComment = (index) => {
        const newComments = comments.filter((_, i) => i !== index);
        setComments(newComments);
        localStorage.setItem(id, JSON.stringify(newComments));  // Kommentare erneut speichern
    };

    // Theme wechseln
    useEffect(() => {
        localStorage.setItem("theme", theme);
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    if (!movie) return <div className="text-white text-center mt-8">Lädt...</div>;

    return (
        // Hauptcontainer mit dynamischem Hintergrund basierend auf dem aktuellen Theme (dunkel/hell)
        <div className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} min-h-screen flex flex-col items-center justify-center p-12 relative`}>

            {/* Schließen-Button, der zur Startseite navigiert */}
            <button onClick={() => navigate("/")} className="absolute top-6 right-6 text-gray-500 text-3xl">✖</button>

            {/* Container für die Film-Details mit dynamischer Hintergrundfarbe und Schatten */}
            <div className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-100"} p-8 rounded-lg shadow-lg flex flex-col w-[800px]`} style={{ minHeight: `${450 + comments.length * 50}px` }}>

                {/* Flexbox für das Film-Poster und die Details */}
                <div className="flex">
                    {/* Film-Poster */}
                    <img src={movie.Poster} alt={movie.Title} className="w-52 rounded-lg" />

                    {/* Container für die Filminformationen */}
                    <div className="ml-8 flex flex-col justify-between flex-1">
                        <h1 className="text-3xl font-bold">{movie.Title}</h1>
                        <p className="text-yellow-400 text-lg">⭐ {movie.imdbRating} • {movie.Year}</p>
                        <p className="mt-4 text-gray-300 text-base">{movie.Plot}</p>

                        {/* Bewertungseingabe (1-10) */}
                        <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="10" className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-300"} w-full p-2 rounded text-white mt-2`} />

                        {/* Kommentar-Eingabefeld */}
                        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Dein Kommentar" className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-300"} w-full p-2 rounded text-white mt-2`} />

                        {/* Button zum Hinzufügen eines Kommentars */}
                        <button onClick={handleAddComment} className="mt-2 bg-blue-600 text-white py-2 px-4 rounded">Kommentar hinzufügen</button>
                    </div>
                </div>

                {/* Kommentarbereich */}
                <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} mt-4 p-4 rounded-lg w-full`}>
                    <h2 className="text-xl font-bold mb-2">Kommentare</h2>
                    {comments.length > 0 ? (
                        comments.map((c, index) => (
                            <div key={index} className={`flex justify-between items-center ${theme === "dark" ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-black"} mt-2 p-2 rounded`}>
                                <p>{c.text} ({c.rating}/10)</p>
                                {/* Button zum Löschen eines Kommentars */}
                                <button onClick={() => handleDeleteComment(index)} className="text-red-500 text-lg">❌</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Noch keine Kommentare.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;