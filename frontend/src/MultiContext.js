import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./util";
import { AuthContext } from "./AuthContext";

export const MultiContext = createContext();

export default function MultiProvider({ children }) {
  const authCtx = useContext(AuthContext);

  const [accounts, setAccounts] = useState([]);
  const [txns, setTxns] = useState([]);
  const [bills, setBills] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("cash-journal-last-page") || "accounts"
  );

  const addAccount = (e, name, balance) => {
    setLoading(true);
    e.preventDefault();
    api("add_account", { name: name, balance: balance }, (data) => {
      setAccounts(data.accounts);
      setLoading(false);
    });
  };

  const getAccounts = () => {
    setLoading(true);
    api("get_accounts", {}, (data) => {
      setAccounts(data.accounts);
      setLoading(false);
    });
  };

  const deleteAccount = (id) => {
    setLoading(true);
    api("delete_account", { id: id }, (data) => {
      setAccounts(data.accounts);
      setLoading(false);
    });
  };

  const addTxn = (e, amount, merchant, accountId, isCharge) => {
    setLoading(true);
    e.preventDefault();
    api(
      "add_txn",
      { amount: amount, merchant: merchant, id: accountId, isCharge: isCharge },
      (data) => {
        setAccounts(data.accounts);
        setTxns(data.txns);
        setLoading(false);
      }
    );
  };

  const getTxns = (id) => {
    setLoading(true);
    api("get_txns", { id: id }, (data) => {
      setTxns(data.txns);
      setLoading(false);
    });
  };

  const getShoppingList = () => {
    setLoading(true);
    api("get_shopping_list", {}, (data) => {
      setShoppingList(data.shoppingList);
      setLoading(false);
    });
  };

  const addSli = (e, estimate, name) => {
    setLoading(true);
    e.preventDefault();
    api("add_shopping_item", { estimate: estimate, name: name }, (data) => {
      setShoppingList(data.slis);
      setLoading(false);
    });
  };

  const deleteSli = (id) => {
    setLoading(true);
    api("delete_shopping_item", { id: id }, (data) => {
      setShoppingList(data.shoppingList);
      setLoading(false);
    });
  };

  const addBill = (e, name, amount, day_of_month, accountId) => {
    setLoading(true);
    e.preventDefault();
    api(
      "add_bill",
      {
        name: name,
        amount: amount,
        day_of_month: day_of_month,
        accountId: accountId,
      },
      (data) => {
        setBills(data.bills);
        setLoading(false);
      }
    );
  };

  const editBill = (e, id, name, amount, day_of_month, accountId) => {
    setLoading(true);
    e.preventDefault();
    api(
      "edit_bill",
      {
        id: id,
        name: name,
        amount: amount,
        day_of_month: day_of_month,
        accountId: accountId,
      },
      (data) => {
        // setBills(data.bills);
        setLoading(false);
      }
    );
  };

  const getBills = () => {
    setLoading(true);
    api("get_bills", {}, (data) => {
      setBills(data.bills);
      setAccounts(data.accounts);
    });
  };

  const deleteBill = (id) => {
    api("delete_bill", { id: id }, (data) => setBills(data.bills));
  };

  useEffect(() => {
    localStorage.setItem("cash-journal-last-page", currentPage);
  }, [currentPage]);

  const contextValue = {
    accounts: accounts,
    setAccounts: setAccounts,
    addAccount: addAccount,
    getAccounts: getAccounts,
    deleteAccount: deleteAccount,

    currentPage: currentPage,
    setCurrentPage: setCurrentPage,

    bills: bills,
    setBills: setBills,
    addBill: addBill,
    editBill: editBill,
    getBills: getBills,
    deleteBill: deleteBill,

    addTxn: addTxn,
    txns: txns,
    setTxns: setTxns,
    getTxns: getTxns,

    shoppingList: shoppingList,
    setShoppingList: setShoppingList,
    getShoppingList: getShoppingList,
    addSli: addSli,
    deleteSli: deleteSli,

    loading: loading,
    setLoading: setLoading,
  };

  return (
    <MultiContext.Provider value={contextValue}>
      {children}
    </MultiContext.Provider>
  );
}
