import { useContext, useEffect, useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Dropdown from "../atoms/Dropdown";
import { Context } from "../../Context";
import { AccountContext } from "../pages/Accounts";

export default function NewBill({ className = "" }) {
  const multiCtx = useContext(Context);
  const accountCtx = useContext(AccountContext);

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
    return accountCtx.accounts.find((x) => x.id == accountId);
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
        onFocus={(e) => e.target.select()}
        className=""
        onChange={onChangeName}
        value={name}
        placeholder="New Bill"
      />
      <input
        onFocus={(e) => e.target.select()}
        style={{ width: "100px" }}
        autoComplete="off"
        onChange={onChangeAmount}
        type="number"
        step={0.01}
        className="form-control form-control-sm mx-1"
        value={amount}
      />
      <input
        onFocus={(e) => e.target.select()}
        style={{ width: "100px" }}
        autoComplete="off"
        max={31}
        min={1}
        onChange={onChangeDayOfMonth}
        type="number"
        step={1}
        className="form-control form-control-sm me-1"
        value={dayOfMonth}
      />
      <Dropdown
        classNameBtn="text-truncate"
        icon="bi:credit-card-fill"
        text={getAccount()?.id}>
        {accountCtx.accounts.map((x) => (
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
        icon="bi:plus-lg"
        type_="submit"
      />
    </form>
  );
}
