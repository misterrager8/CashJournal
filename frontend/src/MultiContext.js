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

  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("cash-journal-last-page") || "accounts"
  );

  const addAccount = (e, name, balance) => {
    e.preventDefault();
    api("add_account", { name: name, balance: balance }, (data) => {
      setAccounts(data.accounts);
    });
  };

  const getAccounts = () => {
    api("get_accounts", {}, (data) => setAccounts(data.accounts));
  };

  const deleteAccount = (id) => {
    api("delete_account", { id: id }, (data) => setAccounts(data.accounts));
  };

  const addTxn = (e, amount, merchant, accountId, isCharge) => {
    e.preventDefault();
    api(
      "add_txn",
      { amount: amount, merchant: merchant, id: accountId, isCharge: isCharge },
      (data) => {
        setAccounts(data.accounts);
        setTxns(data.txns);
      }
    );
  };

  const getTxns = (id) => {
    api("get_txns", { id: id }, (data) => {
      setTxns(data.txns);
    });
  };

  const getShoppingList = () => {
    api("get_shopping_list", {}, (data) => setShoppingList(data.shoppingList));
  };

  const addSli = (e, estimate, name) => {
    e.preventDefault();
    api("add_shopping_item", { estimate: estimate, name: name }, (data) => {
      setShoppingList(data.slis);
    });
  };

  const deleteSli = (id) => {
    api("delete_shopping_item", { id: id }, (data) => {
      setShoppingList(data.shoppingList);
    });
  };

  const addBill = (e, name, amount, day_of_month) => {
    e.preventDefault();
    api(
      "add_bill",
      { name: name, amount: amount, day_of_month: day_of_month },
      (data) => {
        setBills(data.bills);
      }
    );
  };

  const getBills = () => {
    api("get_bills", {}, (data) => setBills(data.bills));
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
  };

  return (
    <MultiContext.Provider value={contextValue}>
      {children}
    </MultiContext.Provider>
  );
}
