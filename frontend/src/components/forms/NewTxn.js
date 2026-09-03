import { useContext, useEffect, useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { Context } from "../../Context";
import { AccountContext } from "../pages/Accounts";
import Dropdown from "../atoms/Dropdown";
import { api } from "../../util";
import { Icon } from "@iconify/react";

export default function NewTxn({ className = "" }) {
  const ctx = useContext(Context);
  const accountCtx = useContext(AccountContext);

  // const [merchant, setMerchant] = useState("");
  // const onChangeMerchant = (e) => setMerchant(e.target.value);

  // const [amount, setAmount] = useState(0.01);
  // const onChangeAmount = (e) => setAmount(e.target.value);

  const [quickInput, setQuickInput] = useState("");
  const onChangeQuickInput = (e) => setQuickInput(e.target.value);

  const [parsedInput, setParsedInput] = useState(null);

  const [account, setAccount] = useState(null);
  // const [category, setCategory] = useState(null);

  const [isDeposit, setIsDeposit] = useState(false);
  const [pending, setPending] = useState(false);

  const resetAll = () => {
    // setMerchant("");
    // setAmount(0.01);
    // setCategory(null);
    setIsDeposit(false);
    setQuickInput("");
    setParsedInput(null);
  };

  const addTxn = (e) => {
    ctx.setLoading(true);
    e.preventDefault();

    api(
      "add_txn",
      {
        amount: parsedInput[1],
        merchant: parsedInput[2],
        id: account?.id,
        isCharge: !isDeposit,
        // categoryId: category,
        type_: isDeposit ? "income" : "expense",
        pending: pending,
      },
      (data) => {
        accountCtx.setAccounts(data.accounts);
        accountCtx.setTxns(data.txns);
        ctx.setBudgets(data.budgets);

        resetAll();
        ctx.setLoading(false);
      },
    );
  };

  useEffect(() => {
    accountCtx.accounts.length > 0 && setAccount(accountCtx.accounts[0]);
  }, [accountCtx.accounts]);

  useEffect(() => {
    setParsedInput(quickInput.match(/^\$?(\d+(?:\.\d{1,2})?)\s*@\s*(.+)$/));
  }, [quickInput]);

  return (
    <form
      onSubmit={(e) => {
        addTxn(e);
      }}>
      <>
        <div className={className + " txn-form"}>
          {/* <Dropdown
          classNameBtn="py-1"
          border={false}
          icon="tdesign:store-filled"
          target="all-merchants">
          <div style={{ height: "300px", overflowY: "auto" }}>
            {ctx.merchants.map((x) => (
              <a onClick={() => setMerchant(x)} className="dropdown-item">
                {x}
              </a>
            ))}
          </div>
        </Dropdown> */}
          <Button
            onClick={() => setIsDeposit(!isDeposit)}
            className={isDeposit ? "green" : "red"}
            border={false}
            icon={"bi:" + (isDeposit ? "plus-" : "dash-") + "lg"}
          />
          <Input
            onFocus={(e) => e.target.select()}
            className={"border-0" + (isDeposit ? " green" : " red")}
            placeholder="Amount @ Merchant"
            value={quickInput}
            onChange={onChangeQuickInput}
          />
          {/* <Input
          onFocus={(e) => e.target.select()}
          className={"border-0" + (isDeposit ? " green" : " red")}
          placeholder="Amount @ Merchant"
          value={merchant}
          onChange={onChangeMerchant}
        /> */}
          {/* <input
          onFocus={(e) => e.target.select()}
          placeholder="0.01"
          min={0.01}
          type="number"
          step={0.01}
          autoComplete="off"
          value={amount}
          onChange={onChangeAmount}
          className={
            "form-control form-control-sm border-0 p-0 " +
            (!isDeposit ? "red" : "green")
          }
        /> */}
          {/* <a
          data-bs-target="#choose-budget"
          data-bs-toggle="dropdown"
          className="btn btn-sm dropdown-toggle border-0">
          {category ? (
            <Icon
              style={{
                color: ctx.budgets.find((x) => x.id === category)?.color,
              }}
              inline
              icon={
                ctx.budgets.find((x) => x.id === category)?.icon ||
                "uis:graph-bar"
              }
              className=" me-2"
            />
          ) : (
            <Icon inline icon="bi:dash-lg" className=" me2" />
          )}
        </a>
        <div id="choose-budget" className={" dropdown-menu"}>
          <a
            onClick={() => setCategory(null)}
            className={"dropdown-item" + (!category ? " active" : "")}>
            None
          </a>
          {ctx.budgets.map((item) => (
            <a
              onClick={() => setCategory(item.id)}
              className={
                "dropdown-item" + (category === item.id ? " active" : "")
              }>
              <Icon
                style={{ color: item.color }}
                className="me-2"
                inline
                icon={item.icon || "uis:graph-bar"}
              />
              {item.name}
            </a>
          ))}
        </div> */}
          <Dropdown
            classNameBtn="border-0"
            target="choose-account"
            icon="bi:credit-card-fill"
            text={account?.name}>
            {accountCtx.accounts.map((item) => (
              <div onClick={() => setAccount(item)} className="dropdown-item">
                {item.name}
              </div>
            ))}
          </Dropdown>
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
                active={pending}
                border={false}
                text="Pending?"
                onClick={() => setPending(!pending)}
                icon={"bi:" + (pending ? "check-square-fill" : "square")}
              />
              <Button
                onClick={() => resetAll()}
                className="red mx-1"
                icon="bi:eraser-fill"
                // border={false}
              />
              <Button
                type_="submit"
                className="green"
                icon="bi:plus-lg"
                // border={false}
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
