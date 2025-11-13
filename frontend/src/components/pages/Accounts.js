import { createContext, useContext, useEffect, useState } from "react";
import AccountItem from "../items/AccountItem";
import TxnItem from "../items/TxnItem";
import NewAccount from "../forms/NewAccount";
import NewTxn from "../forms/NewTxn";
import { Context } from "../../Context";
import { api } from "../../util";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

export const AccountContext = createContext();

export default function Accounts({ className = "" }) {
  const ctx = useContext(Context);

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [txns, setTxns] = useState([]);

  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [accountName, setAccountName] = useState("");
  const onChangeAccountName = (e) => setAccountName(e.target.value);

  const [accountBalance, setAccountBalance] = useState(0.0);
  const onChangeAccountBalance = (e) => setAccountBalance(e.target.value);

  const getAccounts = () => {
    ctx.setLoading(true);
    api("get_accounts", {}, (data) => {
      setAccounts(data.accounts);
      ctx.setLoading(false);
    });
  };

  const getTxns = (id) => {
    ctx.setLoading(true);
    api("get_txns", { id: id }, (data) => {
      setTxns(data.txns);
      ctx.setLoading(false);
    });
  };

  const editAccount = (e) => {
    e.preventDefault();
    api(
      "edit_account",
      {
        id: selectedAccount?.id,
        name: accountName,
        balance: accountBalance,
      },
      (data) => {
        setSelectedAccount(data.account);
        setAccounts(data.accounts);
      }
    );
  };

  useEffect(() => {
    ctx.currentUser && getAccounts();
  }, [ctx.currentUser]);

  useEffect(() => {
    setAccountName(selectedAccount?.name);
    setAccountBalance(selectedAccount?.balance);
    getTxns(selectedAccount?.id);
  }, [selectedAccount]);

  useEffect(() => {
    setEditing(false);
  }, [selectedAccount]);

  const contextValue = {
    selectedAccount: selectedAccount,
    setSelectedAccount: setSelectedAccount,
    accounts: accounts,
    setAccounts: setAccounts,

    txns: txns,
    setTxns: setTxns,
  };

  return (
    <AccountContext.Provider value={contextValue}>
      <div className={className + " flex"}>
        <div className="col-33">
          <NewAccount className="mb-3" />
          {accounts.map((item) => (
            <AccountItem item={item} />
          ))}
          <div
            onClick={() => setSelectedAccount(null)}
            className={
              className + " account-item" + (!selectedAccount ? " active" : "")
            }>
            <div className="fw-bold">All Accounts</div>
            <div className="font-monospace">
              {parseFloat(
                accounts.reduce((x, y) => x + y.balance, 0)
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="col-67">
          <div>
            <div className="text-center">
              {!editing ? (
                <>
                  <div style={{ fontSize: "1.5rem" }}>
                    {selectedAccount ? selectedAccount?.name : "All Accounts"}
                  </div>
                  <div style={{ fontSize: "3.5rem" }}>
                    {parseFloat(
                      selectedAccount
                        ? selectedAccount?.balance
                        : accounts.reduce((x, y) => x + y.balance, 0)
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </div>
                </>
              ) : (
                <form onSubmit={(e) => editAccount(e)}>
                  <Input
                    className="border-0"
                    style={{ fontSize: "1.5rem", textAlign: "center" }}
                    value={accountName}
                    onChange={onChangeAccountName}
                  />
                  <input
                    style={{ fontSize: "3.5rem", textAlign: "center" }}
                    type="number"
                    step={0.01}
                    autoComplete="off"
                    className="form-control form-control-sm border-0"
                    value={accountBalance}
                    onChange={onChangeAccountBalance}
                  />
                  <Button type_="submit" className="d-none" />
                </form>
              )}
            </div>
            {selectedAccount && (
              <div className="d-flex">
                <div className="mx-auto">
                  <Button
                    border={false}
                    active={editing}
                    icon="pencil"
                    onClick={() => setEditing(!editing)}
                  />
                  {deleting && (
                    <Button
                      border={false}
                      className="red"
                      icon="question-lg"
                      // onClick={() => setEditing(!editing)}
                    />
                  )}
                  <Button
                    border={false}
                    className="red"
                    icon="x-lg"
                    onClick={() => setDeleting(!deleting)}
                  />
                </div>
              </div>
            )}
            <NewTxn className="my-4" />
            <div className="txn-scroll">
              {txns.map((item) => (
                <TxnItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AccountContext.Provider>
  );
}
