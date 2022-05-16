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
    axios.get("/api/images").then((response) => {
      setImages(response.data);
      setLoading(false);
    });
  }

  useEffect(() => {
    if (currentIndex === 0) {
      fetchImages();
    }
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
              src={`/api/image/${images[currentIndex]}`}
              alt=""
              className="relative w-full h-full"
            />
          </div>
      )}
    </>
  );
}
