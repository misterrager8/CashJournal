import { useContext, useEffect, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { MultiContext } from "../../MultiContext";
import Dropdown from "../Dropdown";

export default function NewBill({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0.01);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [accountId, setAccountId] = useState(null);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeAmount = (e) => setAmount(e.target.value);
  const onChangeDayOfMonth = (e) => setDayOfMonth(e.target.value);

  useEffect(() => {
    setAccountId(multiCtx.accounts?.[0]?.id);
  }, [multiCtx.accounts]);

  const getAccount = () => {
    return multiCtx.accounts.find((x) => x.id == accountId);
  };

  return (
    <form
      onSubmit={(e) => {
        multiCtx.addBill(e, name, amount, dayOfMonth, accountId);
        setName("");
        setAmount(0.01);
        setDayOfMonth(1);
      }}
      className={className + " d-flex"}>
      <Input
        className=""
        onChange={onChangeName}
        value={name}
        placeholder="New Bill"
      />
      <input
        style={{ width: "100px" }}
        autoComplete="off"
        onChange={onChangeAmount}
        type="number"
        step={0.01}
        className="form-control mx-1"
        value={amount}
      />
      <input
        style={{ width: "100px" }}
        autoComplete="off"
        max={31}
        min={1}
        onChange={onChangeDayOfMonth}
        type="number"
        step={1}
        className="form-control me-1"
        value={dayOfMonth}
      />
      <Dropdown icon="piggy-bank-fill" size={null} text={getAccount()?.name}>
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
        text="Add Bill"
        icon="plus-lg"
        type_="submit"
      />
    </form>
  );
}
