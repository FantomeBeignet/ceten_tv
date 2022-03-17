import { useEffect, useState } from "react";
import axios from "axios";

const { REACT_APP_SERVER_IP } = process.env;

export default function Carousel() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.defaults.baseURL = `http://${REACT_APP_SERVER_IP}:8080`;
    axios.get("/api/images").then((response) => {
      setImages(response.data);
      setLoading(false);
    });
  }, []);

  console.log(images);

  return (
    <>
      {loading ? (
        <span>coucou</span>
      ) : (
        <div className="flex items-center justify-center">
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
