import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TopButtonBar from "../components/TopButtonBar";
import SingleDeleteButton from "../components/SingleDeleteButton";
import Image from "../components/Image";

export default function SingleImagePage() {
  const params = useParams();
  const imageName = params.imagename as string;
  return (
    <>
      <Navbar />
      <TopButtonBar
        text={imageName}
        button={SingleDeleteButton({ imageName: imageName })}
      />
      <Image imageName={imageName} />
    </>
  );
}
