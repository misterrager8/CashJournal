import { useContext, useEffect, useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { Context } from "../../Context";
import { AccountContext } from "../pages/Accounts";
import Dropdown from "../atoms/Dropdown";
import { api } from "../../util";
import { Icon } from "@iconify/react";

export default function SplitTxn({ className = "" }) {
  const ctx = useContext(Context);
  const accountCtx = useContext(AccountContext);

  const [quickInput, setQuickInput] = useState("");
  const onChangeQuickInput = (e) => setQuickInput(e.target.value);
  const [isDeposit, setIsDeposit] = useState(false);

  const [parsedInput, setParsedInput] = useState(null);

  const resetAll = () => {
    setQuickInput("");
    setParsedInput(null);
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

            <div className="ms-3">
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
