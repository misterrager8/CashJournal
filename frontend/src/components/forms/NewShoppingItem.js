import { useContext, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { MultiContext } from "../../MultiContext";

export default function NewShoppingItem({ className = "" }) {
  const multiCtx = useContext(MultiContext);

  const [estimate, setEstimate] = useState(0.0);
  const [name, setName] = useState("");

  const onChangeEstimate = (e) => setEstimate(e.target.value);
  const onChangeName = (e) => setName(e.target.value);

  return (
    <form
      onSubmit={(e) => {
        multiCtx.addSli(e, estimate, name);
        setEstimate(0.0);
        setName("");
      }}
      className={className + " input-group input-group-sm"}>
      <Input onChange={onChangeName} value={name} placeholder="New Item" />
      <input
        autoComplete="off"
        required
        onChange={onChangeEstimate}
        type="number"
        step={0.01}
        className="form-control"
        defaultValue={estimate}
      />
      <Button
        className="d-none"
        border={false}
        text="Add To List"
        icon="plus-lg"
        type_="submit"
      />
    </form>
  );
}
