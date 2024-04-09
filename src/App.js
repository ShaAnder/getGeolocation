import { useState, useEffect } from "react";

function useGeolocation() {
  const [position, setPosition] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // need to use effects in order to use hook
  function getPosition() {
    // firstly error check, if not possible to use geolocation set error message
    if (!navigator.geolocation) {
      return setError("Your browser does not support geolocation");
    }

    // set our loading state to true for the duration of the effect
    setIsLoading(true);
    // get our current position
    navigator.geolocation.getCurrentPosition(
      // our callback function, position
      (pos) => {
        // set position in state
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        // finally swap loading state
        setIsLoading(false);
      },

      // if there is an error it will be displayed here
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    )
    }
  // now return what we need
  return { position, isLoading, error, getPosition };
}

export default function App() {
  const [countClicks, setCountClicks] = useState(0);
  const { position: {lat, lng}, isLoading, error, getPosition } = useGeolocation();


  function handleClick() {
    setCountClicks((count) => count + 1);
    getPosition()
  }

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        Get my position
      </button>

      {isLoading && <p>Loading position...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && lat && lng && (
        <p>
          Your GPS position:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
          >
            {lat}, {lng}
          </a>
        </p>
      )}

      <p>You requested position {countClicks} times</p>
    </div>
  );
}
