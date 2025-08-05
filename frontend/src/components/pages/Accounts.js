import { createContext, useContext, useEffect, useState } from "react";
import { MultiContext } from "../../MultiContext";
import NewAccount from "../forms/NewAccount";
import NewTxn from "../forms/NewTxn";
import TxnItem from "../items/TxnItem";
import Button from "../Button";
import EditAccount from "../forms/EditAccount";
import AccountItem from "../items/AccountItem";

export const AccountContext = createContext();

export default function Accounts() {
  const multiCtx = useContext(MultiContext);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    multiCtx.getTxns(selectedAccount?.id);
  }, [selectedAccount]);

  useEffect(() => {
    multiCtx.getAccounts();
  }, []);

  const contextValue = {
    selectedAccount: selectedAccount,
    setSelectedAccount: setSelectedAccount,
  };

  return (
    <AccountContext.Provider value={contextValue}>
      <div className="row border-bottom" style={{ height: "93vh" }}>
        <div className="col-md-4 px-4">
          <NewAccount className="mb-4" />
          {multiCtx.accounts.map((x) => (
            <AccountItem key={x.id} item={x} />
          ))}
          <div
            className={
              "fw-bold item account-item" + (selectedAccount ? "" : " active")
            }
            onClick={() => setSelectedAccount(null)}>
            <div>All Accounts</div>
            <div className="font-monospace">
              {parseFloat(
                multiCtx.accounts.reduce((x, y) => x + parseFloat(y.balance), 0)
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
          </div>
        </div>
        <div className="col px-4 ">
          <div className="text-center my-5">
            {!editing ? (
              <>
                <h5>
                  {selectedAccount ? selectedAccount?.name : "All Accounts"}
                </h5>
                <div style={{ fontSize: "6rem" }}>
                  {parseFloat(
                    selectedAccount
                      ? selectedAccount?.balance
                      : multiCtx.accounts.reduce(
                          (x, y) => x + parseFloat(y.balance),
                          0
                        )
                  ).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>
              </>
            ) : (
              <EditAccount />
            )}

            {selectedAccount && (
              <>
                <Button
                  onClick={() => setEditing(!editing)}
                  icon="pencil"
                  border={false}
                />
                {deleting && (
                  <Button
                    className="red"
                    onClick={() => {
                      multiCtx.deleteAccount(selectedAccount.id);
                      setSelectedAccount(null);
                    }}
                    icon="question-lg"
                    border={false}
                  />
                )}
                <Button
                  className="red"
                  onClick={() => setDeleting(!deleting)}
                  icon="trash2"
                  border={false}
                />
              </>
            )}
          </div>
          {multiCtx.accounts.length > 0 && <NewTxn className="mb-3" />}
          <div
            // className=" border-bottom"
            style={{ height: "40vh", overflowY: "auto" }}>
            {multiCtx.txns.length > 0 && (
              <div className="between small border-bottom pb-2 fw-bold">
                <span>Merchant</span>
                <span>Amount</span>
                <span>Account</span>
                <span>Timestamp</span>
                <span></span>
              </div>
            )}
            {multiCtx.txns.map((x) => (
              <TxnItem key={x.id} item={x} />
            ))}
          </div>
        </div>
      </div>
    </AccountContext.Provider>
  );
}
