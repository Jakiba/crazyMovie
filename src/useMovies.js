import { useEffect, useState } from "react";

const KEY = "111f3973";

//custom hook, with argument query (not prop!)
export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  //fetch data with useEffect and clean them up!!!
  useEffect(
    function () {
      // handleCloseMovie(); // to close open movie, when searching for new one!
      callback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
          //console.log(movies);  does not work, 'stale state', setting state is asynchronous, so setMoovies only sets the new state AFTER function call!
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message); // so that an error message is not set for aborted requests! (javascript sees canceled requests as error!)
            console.log(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      //cleanup-function to solve the problem of race conditions (the first request is slower than all other requests, and so at the end you get the information for the first request!) and the problem of doing to many requests!
      //cleanup gets called on every rerender, so every keystroke, and so everytime we hit a new key, the last keystroke is aborted until the last one!
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  //returning everything we need in the component where we use this custom hook!
  return { movies, isLoading, error };
}
