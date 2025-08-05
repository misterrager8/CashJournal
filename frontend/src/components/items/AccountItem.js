import { useContext } from "react";
import { AccountContext } from "../pages/Accounts";

export default function AccountItem({ item, className = "" }) {
  const acctCtx = useContext(AccountContext);
  // const [deleting, setDeleting] = useState(false);

  return (
    <div
      className={
        className +
        " item account-item" +
        (acctCtx.selectedAccount?.id === item.id ? " active" : "")
      }
      onClick={() => acctCtx.setSelectedAccount(item)}>
      <div>{item.name}</div>
      <div className="font-monospace">
        {parseFloat(item.balance).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </div>
    </div>
  );
}
