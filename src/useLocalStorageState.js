import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  // using a callback function that returns the initial value of this state
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState; // we get back a json string, so we need to parse it to get the original object!
  });

  //saving the watched movies array in local storage!
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
