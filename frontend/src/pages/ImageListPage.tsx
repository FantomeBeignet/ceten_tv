import Navbar from "../components/Navbar";
import TopButtonBar from "../components/TopButtonBar";
import UploadButton from "../components/UploadButton";
import ImageList from "../components/ImageList";

export default function ImageListPage() {
  return (
    <>
      <Navbar />
      <TopButtonBar text="Images" button={UploadButton()} />
      <ImageList />
    </>
  );
}
