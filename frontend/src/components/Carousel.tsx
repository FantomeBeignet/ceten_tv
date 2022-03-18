import { useEffect, useState } from "react";
import axios from "axios";

const { REACT_APP_SERVER_IP } = process.env;
const INTERVAL = 8000;

export default function Carousel() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  function fetchImages() {
    axios.defaults.baseURL = `http://${REACT_APP_SERVER_IP}:8080`;
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
      setCurrentIndex((currentIndex + 1) % images.length);
    }, INTERVAL);
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <div key={currentIndex} className="flex items-center justify-center">
          <img
            src={require(`../../public/images/${images[currentIndex]}`)}
            alt=""
            className="relative w-full h-full"
          />
        </div>
      )}
    </>
  );
}
