import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TopButtonBar from "../components/TopButtonBar";
import SingleDeleteButton from "../components/SingleDeleteButton";
import Image from "../components/Image";

export default function SingleImagePage() {
  const { imagename } = useParams();
  const displayName = imagename!.split(".")[0];
  return (
    <>
      <Navbar />
      <TopButtonBar
        text={displayName}
        button={SingleDeleteButton({ imageName: imagename! })}
      />
      <Image imageName={imagename!} />
    </>
  );
}
