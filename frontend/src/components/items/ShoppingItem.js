import { useContext, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { MultiContext } from "../../MultiContext";
import { TaxContext } from "../pages/ShoppingList";
import { api } from "../../util";

export default function ShoppingItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const taxCtx = useContext(TaxContext);
  const [deleting, setDeleting] = useState(false);

  const [estimate, setEstimate] = useState(item.estimate);
  const [name, setName] = useState(item.name);

  const onChangeEstimate = (e) => setEstimate(e.target.value);
  const onChangeName = (e) => setName(e.target.value);

  const editShoppingItem = (e) => {
    e.preventDefault();
    api(
      "edit_shopping_item",
      {
        id: item.id,
        name: name,
        estimate: estimate,
      },
      (data) => multiCtx.setShoppingList(data.shoppingList)
    );
  };

  const toggleBought = () => {
    api(
      "toggle_bought",
      {
        id: item.id,
      },
      (data) => multiCtx.setShoppingList(data.shoppingList)
    );
  };

  return (
    <form
      onSubmit={(e) => editShoppingItem(e)}
      className={
        className +
        " between item mb-1" +
        (item.bought ? " opacity-50 bought" : "")
      }>
      <div className="d-flex">
        <Button onClick={() => toggleBought()} border={false} icon="check-lg" />
        <Input
          disabled={item.bought}
          className="border-0"
          onChange={onChangeName}
          value={name}
        />
        <input
          disabled={item.bought}
          autoComplete="off"
          onChange={onChangeEstimate}
          type="number"
          step={0.01}
          className="form-control border-0 w-50 mx-1"
          defaultValue={estimate}
        />
        {taxCtx.includeTax && (
          <span className="small p-2">
            (
            {taxCtx.includeTax
              ? parseFloat(
                  item.estimate * (taxCtx.includeTax ? 1.07 : 1)
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })
              : ""}
            )
          </span>
        )}
      </div>
      <div className="between">
        <div></div>
        <div>
          {deleting && (
            <Button
              onClick={() => multiCtx.deleteSli(item.id)}
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
        </div>
      </div>
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
