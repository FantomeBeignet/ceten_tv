import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import axios from "axios";

const { REACT_APP_SERVER_IP } = process.env;
const INTERVAL = 8000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Carousel() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageShowing, setImageShowing] = useState(true);

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
      setImageShowing(false);
      sleep(300).then(() => {
        setCurrentIndex((currentIndex + 1) % images.length);
        setImageShowing(true);
      });
    }, INTERVAL);
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Transition
          as={Fragment}
          appear={true}
          show={isImageShowing}
          enter="transition-opacity ease-linear duration-200"
          enterFrom="opacity-20"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-20"
        >
          <div className="flex items-center justify-center bg-black">
            <img
              src={`http://${REACT_APP_SERVER_IP}:8080/api/image/${images[currentIndex]}`}
              alt=""
              className="relative w-full h-full"
            />
          </div>
        </Transition>
      )}
    </>
  );
}
