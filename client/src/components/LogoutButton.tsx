import React, { useContext } from "react";
import { GoogleLogout } from "react-google-login";
import { LoginContext } from "../App";

const clientID = process.env.REACT_APP_CLIENT_ID;

export default function LogoutButton() {
  const { setLoggedIn } = useContext(LoginContext);
  function onSuccess() {
    setLoggedIn(false);
  }

  function onFailure() {
    console.log("Failed to logout");
  }

  return (
    <GoogleLogout
      clientId={clientID!}
      onLogoutSuccess={onSuccess}
      onFailure={onFailure}
      render={(renderProps: any) => (
        <button
          onClick={renderProps.onClick}
          className="p-5 text-xl text-center text-white border-2 rounded-lg border-slate-700 hover:underline underline-offset-4"
        >
          Se déconnecter
        </button>
      )}
    />
  );
}
