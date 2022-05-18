import { UploadIcon } from "@heroicons/react/outline";
import axios from "axios";

const uploadImage = async (event: any, addImage: (image: string) => void) => {
  if (event.target.files && event.target.files[0]) {
    var image = event.target.files[0];
    // Create empty form then add the image to it
    const body = new FormData();
    body.append("image", image);
    axios.post("/api/upload", body, {}).then((response) => {
      addImage(image.name);
    });
  }
};

export default function UploadButton(addImage: (image: string) => void) {
  return (
    <>
      <label
        htmlFor="imgToUpload"
        className="flex items-center justify-center gap-2 px-2 py-1 text-sm border rounded-md hover:cursor-pointer lg:border-2 border-emerald-500 lg:text-xl bg-slate-800 text-emerald-500 hover:bg-emerald-500 hover:text-slate-800 lg:px-4 lg:py-3 lg:gap-4 cursor:pointer"
      >
        Ajouter <UploadIcon className="w-5 h-5 lg:h-6 lg:w-6" />
      </label>
      <input
        type="file"
        id="imgToUpload"
        name="image"
        className="hidden"
        accept="image/*"
        onChange={(e) => uploadImage(e, addImage)}
      />
    </>
  );
}
