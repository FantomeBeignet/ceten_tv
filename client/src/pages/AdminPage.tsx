import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import ImageList from "../components/ImageList";
import LoginButton from "../components/LoginButton";
import { LoginContext } from "../App";
import LogoutButton from "../components/LogoutButton";

export default function AdminPage() {
  const { loggedIn } = useContext(LoginContext);
  return (
    <>
      <Navbar />
      {loggedIn ? (
        <>
          <ImageList />
          <div className="flex items-center justify-center w-full my-16">
            <LogoutButton />
          </div>
        </>
      ) : (
        <LoginButton />
      )}
    </>
  );
}
