import { createContext, useEffect, useState } from "react";
import { api } from "./util";

export const Context = createContext();

export default function ContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("cash-journal-page") || "accounts"
  );

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("cash-journal-user"))
  );

  useEffect(() => {
    localStorage.setItem("cash-journal-page", currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("cash-journal-user", JSON.stringify(currentUser));
  }, [currentUser]);

  const signup = (e, username, email, password, passwordConfirm) => {
    e.preventDefault();
    if (password === passwordConfirm) {
      api(
        "signup",
        { username: username, email: email, password: password },
        (data) => {
          setCurrentUser(data.user);
        }
      );
    } else {
      alert("Passwords don't match");
    }
  };

  const login = (e, username, password) => {
    e.preventDefault();
    api("login", { username: username, password: password }, (data) => {
      setCurrentUser(data.user);
      setCurrentPage("accounts");
    });
  };

  const logout = () => {
    api("logout", {}, (data) => {
      setCurrentUser(null);
    });
  };

  const contextValue = {
    loading: loading,
    setLoading: setLoading,

    currentPage: currentPage,
    setCurrentPage: setCurrentPage,

    currentUser: currentUser,
    setCurrentUser: setCurrentUser,

    login: login,
    signup: signup,
    logout: logout,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
