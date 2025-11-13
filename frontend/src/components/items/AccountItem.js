import { useContext } from "react";
import { AccountContext } from "../pages/Accounts";

export default function AccountItem({ item, className = "" }) {
  const accountCtx = useContext(AccountContext);

  return (
    <div
      onClick={() =>
        accountCtx.setSelectedAccount(
          accountCtx.selectedAccount?.id === item.id ? null : item
        )
      }
      className={
        className +
        " account-item" +
        (accountCtx.selectedAccount?.id === item.id ? " active" : "")
      }>
      <div className="fw-bold">{item.name}</div>
      <div className="font-monospace">
        {parseFloat(item.balance).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </div>
    </div>
  );
}
