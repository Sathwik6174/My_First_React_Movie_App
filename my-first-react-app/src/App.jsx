import React, {useEffect, useState} from 'react'
import Search from "./Components/Search.jsx";
import Spinner from "./Components/Spinner.jsx";
import MovieCard from "./Components/MovieCard.jsx";
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";

// Use your Cloudflare Worker URL instead of direct TMDB API
const PROXY_URL = 'https://tmdb-proxy.sathwikpilla2006.workers.dev/'; // Replace with your actual worker URL

// Custom debounce hook
const useDebounceValue = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [trendingMovies, setTrendingMovies] = useState([]);

    // Use custom debounce hook
    const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('')

        try {
            // Call through proxy instead of direct TMDB API
            const path = query
                ? '/search/movie'
                : '/discover/movie?sort_by=popularity.desc';

            const endpoint = query
                ? `${PROXY_URL}?path=${encodeURIComponent(path)}&query=${encodeURIComponent(query)}`
                : `${PROXY_URL}?path=${encodeURIComponent(path)}`;

            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error('Failed to fetch movies.');
            }

            const data = await response.json();

            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies.');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }

        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage('Error searching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies)
        } catch (error) {
            console.error(`Error fetching trending movies: ${error}`);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    return (
        <main>
            <div className='pattern'/>
            <div className='wrapper'>
                <header>
                    <img src='./hero.png' alt='Hero Banner'></img>
                    <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>

                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>
                                        {/*//since index by default starts with 0*/}
                                        {index+1}
                                    </p>
                                    <img src={movie.poster_url} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="all-movies">
                    {/*<h2 className="mt-[40px]">All Movies</h2>*/}
                    <h2>All Movies</h2>
                    {isLoading ? (
                        <Spinner/>
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie}/>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    )
}

export default App