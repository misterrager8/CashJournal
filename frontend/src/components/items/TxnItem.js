import { useContext, useState } from "react";
import { AccountContext } from "../pages/Accounts";
import { moment_ as moment } from "../../util";
import { Icon } from "@iconify/react";
import Button from "../atoms/Button";

export default function TxnItem({ item, className = "" }) {
  const accountCtx = useContext(AccountContext);

  return (
    <div className="d-flex">
      <span
        className="my-auto pe-2"
        style={{ cursor: "pointer" }}
        onClick={() => accountCtx.toggleSelect(item)}>
        <Icon
          inline
          icon={
            accountCtx.selectedTxns.includes(item)
              ? "bi:check-square"
              : "bi:square"
          }
        />
      </span>
      <div
        onClick={() => accountCtx.setSelectedTxn(item)}
        className={
          className +
          " txn-item w-100 text-truncate" +
          (accountCtx.selectedTxns.includes(item) ? " active" : "")
        }>
        <div className="col text-truncate">{item.merchant}</div>
        <div className={"col" + (item.amount < 0 ? " red" : " green")}>
          {item.amount}
        </div>
        <div className="col text-truncate mx-1 small my-auto">
          {item.category && (
            <Icon
              className="me-2"
              inline
              icon="uis:graph-bar"
              style={{ color: item.category?.color }}
            />
          )}
          {item.category?.name}
        </div>
        <div className="col text-truncate">{item.accountName}</div>
        <div
          title={moment(item.timestamp).format("llll")}
          className="col-1 d-flex flex-row-reverse">
          {moment(item.timestamp).format("M/D")}
        </div>
      </div>
    </div>
  );
}
