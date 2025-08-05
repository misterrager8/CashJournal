import { useContext, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { MultiContext } from "../../MultiContext";

export default function NewBill({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0.0);
  const [dayOfMonth, setDayOfMonth] = useState(1);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeAmount = (e) => setAmount(e.target.value);
  const onChangeDayOfMonth = (e) => setDayOfMonth(e.target.value);

  return (
    <form
      onSubmit={(e) => {
        multiCtx.addBill(e, name, amount, dayOfMonth);
        setName("");
        setAmount(0.0);
        setDayOfMonth(1);
      }}
      className={className + " input-group input-group-sm"}>
      <Input onChange={onChangeName} value={name} placeholder="New Bill" />
      <input
        autoComplete="off"
        required
        onChange={onChangeAmount}
        type="number"
        step={0.01}
        className="form-control"
        defaultValue={amount}
      />
      <input
        autoComplete="off"
        max={31}
        min={1}
        required
        onChange={onChangeDayOfMonth}
        type="number"
        step={1}
        className="form-control"
        defaultValue={dayOfMonth}
      />
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
