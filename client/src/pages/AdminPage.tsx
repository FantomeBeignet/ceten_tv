import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import ImageList from "../components/ImageList";
import LoginButton from "../components/LoginButton";
import { LoginContext } from "../App";
import LogoutButton from "../components/LogoutButton";
import { useParams } from "react-router-dom";
import TopButtonBar from "../components/TopButtonBar";
import Image from "../components/Image";
import SingleDeleteButton from "../components/SingleDeleteButton";

export default function AdminPage() {
  const { loggedIn } = useContext(LoginContext);
  const { imagename } = useParams();
  var component = null;
  if (imagename !== undefined) {
    const displayName = imagename.split(".")[0];
    component = (
      <>
        <TopButtonBar
          text={displayName}
          button={SingleDeleteButton({ imageName: imagename })}
        />
        <Image imageName={imagename} />
        <div className="flex items-center justify-center w-full">
          <LogoutButton />
        </div>
      </>
    );
  } else {
    component = (
      <>
        <ImageList />
        <div className="flex items-center justify-center w-full">
          <LogoutButton />
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar />
      {loggedIn ? component : <LoginButton />}
    </>
  );
}
