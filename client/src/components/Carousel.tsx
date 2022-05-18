import { Fragment, useEffect, useState } from "react";
import axios from "axios";

const INTERVAL = 8000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Carousel() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  function fetchImages() {
    axios.get("/api/images", {
      // Ensures image list doesn't get cached
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    }).then((response) => {
      setImages(response.data);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchImages();
    // Switch to next image every INTERVAL milliseconds
    const interval = setInterval(() => {
      sleep(300).then(() => {
        setCurrentIndex((currentIndex + 1) % images.length);
      });
    }, INTERVAL);
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  return (
    <>
      {loading ? (
        <></>
      ) : (

          <div className="flex items-center justify-center bg-black">
            <img
              src={`/api/image/${images[currentIndex]}?timestamp=${new Date().getTime()}`} // Timestamp is there to prevent caching, it does nothing special in the API
              alt=""
              className="relative w-full h-full"
            />
          </div>
      )}
    </>
  );
}
