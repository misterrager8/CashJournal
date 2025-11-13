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
      },
      (data) => {
        accountCtx.setAccounts(data.accounts);
        accountCtx.setTxns(data.txns);
        ctx.setLoading(false);

        setMerchant("");
        setAmount(0.01);
      }
    );
  };

  useEffect(() => {
    accountCtx.accounts.length > 0 && setAccount(accountCtx.accounts[0]);
  }, [accountCtx.accounts]);

  return (
    <form onSubmit={(e) => addTxn(e)} className={className + " txn-form"}>
      <div className="d-flex">
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
      </div>
      <div className="d-flex w-100">
        <Input
          placeholder="Merchant"
          value={merchant}
          onChange={onChangeMerchant}
        />
        <Dropdown
          target="chooseAccount"
          icon="piggy-bank-fill"
          text={account?.name}>
          {accountCtx.accounts.map((item) => (
            <div onClick={() => setAccount(item)} className="dropdown-item">
              {item.name}
            </div>
          ))}
        </Dropdown>
      </div>
      <Button type_="submit" className="d-none" />
    </form>
  );
}
