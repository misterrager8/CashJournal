import { useContext, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { MultiContext } from "../../MultiContext";

export default function NewAccount({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0.0);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeBalance = (e) => setBalance(e.target.value);

  return (
    <form
      onSubmit={(e) => {
        multiCtx.addAccount(e, name, balance);
        setName("");
        setBalance(0.0);
      }}
      className={className + " input-group input-group-sm"}>
      <Input onChange={onChangeName} value={name} placeholder="New Account" />
      <input
        autoComplete="off"
        required
        onChange={onChangeBalance}
        type="number"
        step={0.01}
        className="form-control"
        defaultValue={balance}
      />
      <Button
        className="d-none"
        border={false}
        text="Create Account"
        icon="plus-lg"
        type_="submit"
      />
    </form>
  );
}
