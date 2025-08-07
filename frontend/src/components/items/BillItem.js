import { useContext, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { MultiContext } from "../../MultiContext";

export default function BillItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState(item.name);
  const [amount, setAmount] = useState(item.amount);
  const [dayOfMonth, setDayOfMonth] = useState(item.day_of_month);
  const [accountId, setAccountId] = useState(item.accountId);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeAmount = (e) => setAmount(e.target.value);
  const onChangeDayOfMonth = (e) => setDayOfMonth(e.target.value);
  const onChangeAccountId = (e) => setAccountId(e.target.value);

  return (
    <form
      onSubmit={(e) => {
        multiCtx.editBill(e, item.id, name, amount, dayOfMonth, accountId);
      }}
      className={className + " d-flex mb-1 item"}>
      <Input
        className="me-1"
        onChange={onChangeName}
        value={name}
        placeholder="New Bill"
      />
      <input
        autoComplete="off"
        max={31}
        min={1}
        onChange={onChangeDayOfMonth}
        type="number"
        step={1}
        className="form-control me-1"
        value={dayOfMonth}
      />
      <input
        autoComplete="off"
        onChange={onChangeAmount}
        type="number"
        step={0.01}
        className="form-control me-1"
        value={amount}
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

      {deleting && (
        <Button
          onClick={() => multiCtx.deleteBill(item.id)}
          className="red"
          border={false}
          icon="question-lg"
        />
      )}
      <Button
        onClick={() => setDeleting(!deleting)}
        className="red"
        border={false}
        icon="x-lg"
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
