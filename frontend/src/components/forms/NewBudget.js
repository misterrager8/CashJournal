import { useContext, useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { Context } from "../../Context";

export default function NewBudget({ className = "" }) {
  const multiCtx = useContext(Context);

  const [name, setName] = useState("");
  const onChangeName = (e) => setName(e.target.value);

  return (
    <form
      onSubmit={(e) => {
        multiCtx.addBudget(e, name);
        setName("");
      }}
      className={className + " d-flex"}>
      <Input
        className=""
        onChange={onChangeName}
        value={name}
        placeholder="New Budget"
      />
      <Button
        className="d-none"
        border={false}
        text="Add Budget"
        icon="bi:plus-lg"
        type_="submit"
      />
    </form>
  );
}
