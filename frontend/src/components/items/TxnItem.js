import { useContext } from "react";
import { AccountContext } from "../pages/Accounts";
import moment from "moment-timezone";
import { Icon } from "@iconify/react";
import Button from "../atoms/Button";
import { txnTypes } from "../../util";

export default function TxnItem({ item, className = "" }) {
  const accountCtx = useContext(AccountContext);

  return (
    <div className={"d-flex" + (item.pending ? " pending" : "")}>
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
      {item.pending && (
        <span
          className="my-auto px-1"
          style={{ cursor: "pointer" }}
          onClick={() => accountCtx.unpend(item.id)}>
          <Icon inline icon="material-symbols:hourglass-arrow-down-outline" />
        </span>
      )}
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
        <div className="col-1">
          <div className={txnTypes.find((x) => x.value === item.type_)?.color}>
            <Icon icon={txnTypes.find((x) => x.value === item.type_)?.icon} />
          </div>
        </div>
        <div className="col text-truncate mx-1 small my-auto">
          {item.category && (
            <Icon
              className="me-2"
              inline
              icon={item.category?.icon || "uis:graph-bar"}
              style={{ color: item.category?.color }}
            />
          )}
          {item.category?.name}
        </div>
        <div className="col text-truncate">
          <div className="text-truncate">{item.accountName}</div>
        </div>
        <div
          title={moment.tz(item.timestamp, "America/New_York").format("llll")}
          className="col-1 d-flex flex-row-reverse">
          {moment
            .tz(item.timestamp, "America/New_York")
            .format(accountCtx.searchResults.length > 0 ? "M/D/Y" : "M/D")}
        </div>
      </div>
    </div>
  );
}
