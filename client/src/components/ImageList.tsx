import axios from "axios";
import { useState, useEffect } from "react";
import ImageListLine from "./ImageListLine";
import TopButtonBar from "./TopButtonBar";
import UploadButton from "./UploadButton";

export default function ImageList() {
  const [images, setImages] = useState<string[]>([]);

  function removeImage(image: string) {
    setImages(
      images.filter((value, index, arr) => {
        return value !== image;
      })
    );
  }

  function addImage(image: string) {
    const newImages = [...images, image];
    newImages.sort();
    setImages(newImages);
  }

  useEffect(() => {
    axios.get("/api/images").then((response) => setImages(response.data));
  }, []);

  return (
    <>
      <TopButtonBar text="Images" button={UploadButton(addImage)} />

      <div className="flex flex-col items-center justify-center w-11/12 mx-auto lg:w-8/12">
        <table className="w-full">
          <thead className="text-sm text-left text-white border-t border-b-2 lg:text-2xl lg:border-b-4 lg:border-t-2 border-slate-700">
            <tr>
              <th className="px-2 py-2 text-left lg:px-6 lg:py-4">Image</th>
              <th className="px-2 py-2 text-left lg:px-6 lg:py-4">Nom</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => ImageListLine(image, removeImage))}
          </tbody>
        </table>
      </div>
    </>
  );
}
