import React, { useContext, useState } from "react";
import { GoogleLogin } from "react-google-login";
import { LoginContext } from "../App";

const clientID = process.env.REACT_APP_CLIENT_ID; 
const targetID = process.env.REACT_APP_TARGET_ID; // ID of account authorized to log in

export default function LoginButton() {
  const { setLoggedIn } = useContext(LoginContext);
  const [loginFailed, setLoginFailed] = useState(false);

  function onSuccess(googleUser: any) {
    const id = googleUser.getBasicProfile().getId();
    if (id === targetID!) {
      setLoginFailed(false);
      setLoggedIn(true);
    } else {
      setLoginFailed(true);
      return { error: "access_denied" }; // Error code to make sure user isn't logged in
    }
  }

  function onFailure() {
    setLoginFailed(true);
    console.log("Failed to login");
  }

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col items-center justify-center h-full gap-12 p-16 m-16 border-2 max-w-8/12 border-slate-700 rounded-xl">
        <img src="/ceten.png" alt="Le logo du CETEN" className="w-64 h-64" />
        <p className="text-2xl text-center text-white">
          Connectez-vous pour accéder à l'interface administrateur
        </p>
        {loginFailed ? (
          <p className="text-xl text-red-600">Connexion refusée</p>
        ) : (
          <></>
        )}
        <GoogleLogin
          clientId={clientID!}
          onSuccess={onSuccess}
          onFailure={onFailure}
          isSignedIn={true} // Will trigger the onSuccess function on page load to ensure state works correctly
          uxMode={"popup"} // Mode "redirect" is cleaner but somehow doesn't work
          hostedDomain={"telecomnancy.net"}
          redirectUri={"http://localhost:3000/admin/"}
          render={(renderProps: any) => (
            <button
              onClick={renderProps.onClick}
              className="p-5 text-xl text-center text-white border-2 rounded-lg border-slate-700 hover:underline underline-offset-4"
            >
              Se connecter
            </button>
          )}
        />
      </div>
    </div>
  );
}
