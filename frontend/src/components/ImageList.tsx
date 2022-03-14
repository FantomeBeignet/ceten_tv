import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ListDeleteButton from "./ListDeleteButton";

const { REACT_APP_SERVER_IP } = process.env;

export default function ImageList() {
  const [images, setImages] = useState([]);

  function removeImage(image: string) {
    setImages(
      images.filter((value, index, arr) => {
        return value !== image;
      })
    );
  }

  useEffect(() => {
    axios.defaults.baseURL = `http://${REACT_APP_SERVER_IP}:8080`;
    axios.get("/api/images").then((response) => {
      console.log(response.data);
      setImages(response.data);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-11/12 mx-auto lg:w-8/12">
        <table className="w-full">
          <thead className="text-sm text-left text-white border-t border-b-2 lg:text-2xl lg:border-b-4 lg:border-t-2 border-slate-700">
            <tr>
              <th className="px-2 py-2 text-left lg:px-6 lg:py-4">Image</th>
              <th className="px-2 py-2 text-left lg:px-6 lg:py-4">Nom</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => {
              return (
                <tr
                  key={image}
                  className="hover:bg-slate-700 border-y-2 border-slate-700"
                >
                  <td className="relative w-4/12 px-2 py-2 lg:px-6 lg:py-4">
                    <Link to={`/admin/${image}`}>
                      <img
                        src={require(`../../public/images/${image}`)}
                        alt={image}
                      />
                    </Link>
                  </td>
                  <td className="w-10 px-2 py-2 text-xs text-left text-white truncate lg:text-2xl lg:px-6 lg:py-4">
                    <Link to={`/admin/${image}`}>
                      <span>{image}</span>
                    </Link>
                  </td>
                  <td className="px-2 py-2 text-center lg:px-6 lg:py-4">
                    <div className="inline-block">
                      <ListDeleteButton
                        image={image}
                        removeImage={removeImage}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
