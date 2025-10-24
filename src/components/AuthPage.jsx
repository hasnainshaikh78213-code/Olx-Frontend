import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      {showLogin ? (
        <Login onSwitch={() => setShowLogin(false)} />
      ) : (
        <Signup onSwitch={() => setShowLogin(true)} />
      )}
    </>
  );
}

export default AuthPage;
