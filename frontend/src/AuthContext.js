import { createContext, useEffect, useState } from "react";
import { api } from "./util";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [username, setUsername] = useState(
    localStorage.getItem("cashjournal-user") || null
  );
  const [email, setEmail] = useState(
    localStorage.getItem("cashjournal-email") || null
  );

  const signup = (e, username, email, password, passwordConfirm) => {
    e.preventDefault();
    if (password === passwordConfirm) {
      api(
        "signup",
        { username: username, email: email, password: password },
        (data) => {
          setUsername(data.user?.username);
          setEmail(data.user?.email);
        }
      );
    } else {
      alert("Passwords don't match");
    }
  };

  const login = (e, username, password) => {
    e.preventDefault();
    api("login", { username: username, password: password }, (data) => {
      setUsername(data.user?.username);
      setEmail(data.user?.email);
    });
  };

  const logout = () => {
    api("logout", {}, (data) => {
      setUsername(null);
      setEmail(null);
    });
  };

  useEffect(() => {
    if (username && email) {
      localStorage.setItem("cashjournal-user", username);
      localStorage.setItem("cashjournal-email", email);
    } else {
      localStorage.removeItem("cashjournal-user");
      localStorage.removeItem("cashjournal-email");
    }
  }, [username, email]);

  const contextValue = {
    username: username,
    setUsername: setUsername,
    email: email,
    setEmail: setEmail,

    login: login,
    signup: signup,
    logout: logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
