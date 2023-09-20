import { useEffect } from "react";

export function useKey(key, action) {
  //so that the user can press escape to close the movie that is opened up!
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }

      document.addEventListener("keydown", callback);

      // so that the addEventlistener that gets created every time the movieDetails component mounts do not accumulate, so we remove them instantly when the component unmounts!
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [action, key]
  );
}
