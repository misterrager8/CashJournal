import { useContext, useEffect, useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { Context } from "../../Context";
import { AccountContext } from "../pages/Accounts";
import Dropdown from "../atoms/Dropdown";
import { api } from "../../util";
import { Icon } from "@iconify/react";
import moment from "moment-timezone";

export default function SplitTxn({ className = "" }) {
  const ctx = useContext(Context);
  const accountCtx = useContext(AccountContext);

  const [quickInput, setQuickInput] = useState("");
  const onChangeQuickInput = (e) => setQuickInput(e.target.value);
  const [isDeposit, setIsDeposit] = useState(false);

  const [parsedInput, setParsedInput] = useState(null);
  const [category, setCategory] = useState(null);

  const [timestamp, setTimestamp] = useState(
    moment
      .tz(accountCtx.selectedTxn?.timestamp, "America/New_York")
      .format("YYYY-MM-DD HH:mm:ss"),
  );
  const onChangeTimestamp = (e) => setTimestamp(e.target.value);

  const resetAll = () => {
    setQuickInput("");
    setParsedInput(null);
    setTimestamp(
      moment
        .tz(accountCtx.selectedTxn?.timestamp, "America/New_York")
        .format("YYYY-MM-DD HH:mm:ss"),
    );
    setCategory(null);
  };

  const splitTxn = (e) => {
    ctx.setLoading(true);
    e.preventDefault();

    api(
      "split_txn",
      {
        amount: parsedInput[1],
        merchant: parsedInput[2],
        txnId: accountCtx.selectedTxn?.id,
        isCharge: !isDeposit,
        timestamp: timestamp,
        category: category,
      },
      (data) => {
        accountCtx.setSelectedTxn(data.txn);
        accountCtx.setTxns(data.txns);
        resetAll();
        ctx.setLoading(false);
      },
    );
  };

  useEffect(() => {
    setParsedInput(quickInput.match(/^\$?(\d+(?:\.\d{1,2})?)\s*@\s*(.+)$/));
  }, [quickInput]);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        splitTxn(e);
      }}>
      <>
        <div className={className + " txn-form"}>
          <Button
            onClick={() => setIsDeposit(!isDeposit)}
            className={isDeposit ? "green" : "red"}
            border={false}
            icon={"bi:" + (isDeposit ? "plus-" : "dash-") + "lg"}
          />
          <Input
            onFocus={(e) => e.target.select()}
            className={""}
            placeholder="Amount @ Merchant"
            value={quickInput}
            onChange={onChangeQuickInput}
          />
        </div>
      </>
      {parsedInput && (
        <div className="d-flex my-2">
          <div className="between mx-auto" style={{ fontSize: "1.4rem" }}>
            <div className="my-auto">
              {parseFloat(parsedInput[1]).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <Icon className="my-auto mx-1" icon="bi:at" />
            <div className="my-auto">{parsedInput[2]}?</div>

            <div className="d-flex ms-3">
              <input
                max={moment
                  .tz(new Date(), "America/New_York")
                  .format("YYYY-MM-DD")}
                type="datetime-local"
                value={timestamp}
                onChange={onChangeTimestamp}
                autoComplete="off"
                className="form-control border-0"
              />
              <Dropdown
                icon={
                  ctx.budgets.find((x) => x.id === category)?.icon ||
                  "uis:graph-bar"
                }
                border={false}
                classNameBtn="w-100"
                text={
                  ctx.budgets.find((x) => x.id === category)?.name ||
                  "No Budget"
                }
                target="budgets">
                <a onClick={() => setCategory(null)} className="dropdown-item">
                  No Budget
                </a>
                {ctx.budgets.map((x) => (
                  <a
                    onClick={() => setCategory(x.id)}
                    className={
                      "dropdown-item" + (x.id === category ? " active" : "")
                    }>
                    <span
                      style={{
                        color: x.color,
                      }}>
                      <Icon
                        className="me-2"
                        name={x?.icon || "uis:graph-bar"}
                      />
                    </span>
                    {x.name}
                  </a>
                ))}
              </Dropdown>
              <Button
                onClick={() => resetAll()}
                className="red mx-1"
                icon="bi:eraser-fill"
              />
              <Button type_="submit" className="green" icon="bi:plus-lg" />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
