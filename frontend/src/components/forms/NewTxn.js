import { useContext, useEffect, useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { Context } from "../../Context";
import { AccountContext } from "../pages/Accounts";
import Dropdown from "../atoms/Dropdown";
import { api } from "../../util";

export default function NewTxn({ className = "" }) {
  const ctx = useContext(Context);
  const accountCtx = useContext(AccountContext);

  const [merchant, setMerchant] = useState("");
  const onChangeMerchant = (e) => setMerchant(e.target.value);

  const [amount, setAmount] = useState(0.0);
  const onChangeAmount = (e) => setAmount(e.target.value);

  const [account, setAccount] = useState(null);
  const [category, setCategory] = useState(null);

  const [isDeposit, setIsDeposit] = useState(false);

  const addTxn = (e) => {
    ctx.setLoading(true);
    e.preventDefault();
    api(
      "add_txn",
      {
        amount: amount,
        merchant: merchant,
        id: account?.id,
        isCharge: !isDeposit,
        categoryId: category,
      },
      (data) => {
        accountCtx.setAccounts(data.accounts);
        accountCtx.setTxns(data.txns);
        ctx.setBudgets(data.budgets);

        setMerchant("");
        setAmount(0.01);
        ctx.setLoading(false);
      },
    );
  };

  useEffect(() => {
    accountCtx.accounts.length > 0 && setAccount(accountCtx.accounts[0]);
  }, [accountCtx.accounts]);

  return (
    <form onSubmit={(e) => addTxn(e)} className={className + " txn-form"}>
      <Button
        onClick={() => setIsDeposit(!isDeposit)}
        className={isDeposit ? "green" : "red"}
        border={false}
        icon={(isDeposit ? "plus-" : "dash-") + "lg"}
      />
      <input
        placeholder="0.01"
        min={0.01}
        type="number"
        step={0.01}
        autoComplete="off"
        value={amount}
        onChange={onChangeAmount}
        className={
          "form-control form-control-sm " + (!isDeposit ? "red" : "green")
        }
      />
      <Dropdown icon="bxs:purchase-tag" target="all-merchants">
        {ctx.merchants.map((x) => (
          <a onClick={() => setMerchant(x)} className="dropdown-item">
            {x}
          </a>
        ))}
      </Dropdown>
      <Input
        placeholder="Merchant"
        value={merchant}
        onChange={onChangeMerchant}
      />
      <Dropdown
        active={category}
        target="chooseBudget"
        icon="streamline-ultimate:presentation-projector-screen-budget-analytics-bold">
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
            {item.name}
          </a>
        ))}
      </Dropdown>
      <Dropdown
        target="chooseAccount"
        icon="bi:piggy-bank-fill"
        text={account?.name}>
        {accountCtx.accounts.map((item) => (
          <div onClick={() => setAccount(item)} className="dropdown-item">
            {item.name}
          </div>
        ))}
      </Dropdown>
      <Button
        border={false}
        type_="submit"
        className="show-on-mobile"
        icon="bi:caret-right-fill"
        // text="Add"
      />
    </form>
  );
}
