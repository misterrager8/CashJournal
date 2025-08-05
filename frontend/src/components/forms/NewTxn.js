import { useContext, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { MultiContext } from "../../MultiContext";

export default function NewTxn({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [accountId, setAccountId] = useState("");
  const [isCharge, setIsCharge] = useState(true);

  const onChangeAmount = (e) => setAmount(e.target.value);
  const onChangeMerchant = (e) => setMerchant(e.target.value);
  const onChangeAccountId = (e) => setAccountId(e.target.value);

  return (
    <form
      onSubmit={(e) => {
        multiCtx.addTxn(e, amount, merchant, accountId, isCharge);
        setAmount("");
        setMerchant("");
        setAccountId("");
      }}
      className={className + " input-group input-group-sm"}>
      <Button
        className={isCharge ? "red" : "green"}
        onClick={() => setIsCharge(!isCharge)}
        icon={isCharge ? "dash-square" : "plus-square"}
        border={false}
      />
      <input
        autoComplete="off"
        required
        onChange={onChangeAmount}
        type="number"
        step={0.01}
        className="form-control"
        defaultValue={amount}
      />
      <Input
        onChange={onChangeMerchant}
        value={merchant}
        placeholder="Merchant Name"
      />
      <select
        className="form-control"
        value={accountId}
        onChange={onChangeAccountId}
        required>
        {multiCtx.accounts.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
      <Button
        border={false}
        text="Add Transaction"
        icon="plus-lg"
        type_="submit"
      />
    </form>
  );
}
