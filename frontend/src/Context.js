import { createContext, useEffect, useState } from "react";
import { api } from "./util";

export const Context = createContext();

export default function ContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("cash-journal-page") || "accounts",
  );

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("cash-journal-user")),
  );

  const [bills, setBills] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [budgets, setBudgets] = useState([]);

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
        },
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

  const getBills = () => {
    setLoading(true);
    api("get_bills", {}, (data) => {
      setBills(data.bills);
      setAccounts(data.accounts);
    });
  };

  const deleteBill = (id) => {
    setLoading(true);
    api("delete_bill", { id: id }, (data) => setBills(data.bills));
  };

  const addBudget = (e, name) => {
    e.preventDefault();
    setLoading(true);
    api("add_budget", { name: name }, (data) => {
      setBudgets(data.budgets);
      setLoading(false);
    });
  };

  const getBudgets = () => {
    setLoading(true);
    api("get_budgets", {}, (data) => {
      setBudgets(data.budgets);
      setLoading(false);
    });
  };

  const editBudget = (e, id, name, color, icon) => {
    e.preventDefault();
    setLoading(true);
    api(
      "edit_budget",
      { id: id, name: name, color: color, icon: icon },
      (data) => {
        setBudgets(data.budgets);
        setLoading(false);
      },
    );
  };

  const deleteBudget = (id) => {
    setLoading(true);
    api("delete_budget", { id: id }, (data) => {
      setBudgets(data.budgets);
      setLoading(false);
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

    bills: bills,
    setBills: setBills,
    accounts: accounts,
    setAccounts: setAccounts,
    getBills: getBills,
    deleteBill: deleteBill,
    merchants: merchants,
    setMerchants: setMerchants,

    budgets: budgets,
    setBudgets: setBudgets,
    addBudget: addBudget,
    editBudget: editBudget,
    getBudgets: getBudgets,
    deleteBudget: deleteBudget,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
