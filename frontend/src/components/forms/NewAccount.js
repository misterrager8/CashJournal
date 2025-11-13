import { useState } from "react";
import Input from "../atoms/Input";

export default function NewAccount({ className = "" }) {
  const [name, setName] = useState("");
  const onChangeName = (e) => setName(e.target.value);

  const [balance, setBalance] = useState(0.0);
  const onChangeBalance = (e) => setBalance(e.target.value);

  return (
    <div className={className + " input-group"}>
      <Input placeholder="Name" value={name} onChange={onChangeName} />
      <input
        placeholder="0.01"
        type="number"
        step={0.01}
        autoComplete="off"
        value={balance}
        onChange={onChangeBalance}
        className={
          "form-control form-control-sm " + (balance < 0 ? "red" : "green")
        }
      />
      {/* <Input type_="number" value={balance} onChange={onChangeBalance} /> */}
    </div>
  );
}
