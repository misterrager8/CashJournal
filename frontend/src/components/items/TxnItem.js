import { useContext } from "react";
import moment from "moment";
import { AccountContext } from "../pages/Accounts";

export default function TxnItem({ item, className = "" }) {
  const accountCtx = useContext(AccountContext);

  return (
    <div
      onClick={() => accountCtx.setSelectedTxn(item)}
      className={className + " txn-item"}>
      <div className="col text-truncate">{item.merchant}</div>
      <div className={"col" + (item.amount < 0 ? " red" : " green")}>
        {item.amount}
      </div>
      <div className="col text-truncate">{item.accountName}</div>
      <div className="col text-truncate mx-1">{item.category?.name}</div>
      <div
        title={moment(item.timestamp).format("llll")}
        className="col-1 d-flex flex-row-reverse">
        {moment(item.timestamp).format("M/D")}
      </div>
    </div>
  );
}
