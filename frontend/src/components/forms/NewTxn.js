import { useContext, useEffect, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { MultiContext } from "../../MultiContext";
import Dropdown from "../Dropdown";

export default function NewTxn({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [amount, setAmount] = useState(0.01);
  const [merchant, setMerchant] = useState("");
  const [accountId, setAccountId] = useState("");
  const [isCharge, setIsCharge] = useState(true);

  const onChangeAmount = (e) => setAmount(e.target.value);
  const onChangeMerchant = (e) => setMerchant(e.target.value);
  // const onChangeAccountId = (e) => setAccountId(e.target.value);

  useEffect(() => {
    setAccountId(multiCtx.accounts?.[0]?.id);
  }, [multiCtx.accounts]);

  const getAccount = () => {
    return multiCtx.accounts.find((x) => x.id == accountId);
  };

  return (
    <form
      onSubmit={(e) => {
        multiCtx.addTxn(e, amount, merchant, accountId, isCharge);
        setAmount(0.01);
        setMerchant("");
        setAccountId("");
      }}
      className={className + " d-flex"}>
      <Button
        className={isCharge ? "red" : "green"}
        onClick={() => setIsCharge(!isCharge)}
        icon={isCharge ? "dash-lg" : "plus-lg"}
        border={false}
      />
      <input
        style={{ width: "75px" }}
        placeholder="Amount"
        autoComplete="off"
        required
        onChange={onChangeAmount}
        type="number"
        step={0.01}
        className="form-control"
        defaultValue={amount}
      />
      <Input
        className="mx-1"
        onChange={onChangeMerchant}
        value={merchant}
        placeholder="Merchant Name"
      />

      <Dropdown size={null} text={getAccount()?.name}>
        {multiCtx.accounts.map((x) => (
          <div
            className="dropdown-item"
            key={x.id}
            onClick={() => setAccountId(x.id)}>
            {x.name}
          </div>
        ))}
      </Dropdown>
      <Button
        className="d-none"
        border={false}
        text="Add Transaction"
        icon="plus-lg"
        type_="submit"
      />
    </form>
  );
}
