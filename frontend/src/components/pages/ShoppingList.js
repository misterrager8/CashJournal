import { createContext, useContext, useEffect, useState } from "react";
import NewShoppingItem from "../forms/NewShoppingItem";
import { MultiContext } from "../../MultiContext";
import ShoppingItem from "../items/ShoppingItem";
import Button from "../Button";

export const TaxContext = createContext();

export default function ShoppingList() {
  const multiCtx = useContext(MultiContext);
  const [includeTax, setIncludeTax] = useState(true);

  useEffect(() => {
    multiCtx.getShoppingList();
  }, []);

  const contextValue = {
    includeTax: includeTax,
    setIncludeTax: setIncludeTax,
  };

  return (
    <div>
      <div className="mb-5">
        <NewShoppingItem />
      </div>
      <div className="text-center" style={{ fontSize: "5rem" }}>
        <div className="h3">Total</div>
        <div>
          {parseFloat(
            multiCtx.shoppingList
              .filter((x) => !x.bought)
              .reduce(
                (x, y) => x + parseFloat(y.estimate * (includeTax ? 1.07 : 1)),
                0
              )
          ).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>

        <Button
          className=""
          active={includeTax}
          text="Include Tax (7%)"
          onClick={() => setIncludeTax(!includeTax)}
        />
      </div>

      <TaxContext.Provider value={contextValue}>
        <div className="mt-5">
          <div className="between border-bottom py-2 fw-bold">
            <span className="col">Name</span>
            <span className="col">
              {"Estimate" + (includeTax ? " (incl. tax)" : "")}
            </span>
            <span className="col"></span>
            <span className="col"></span>
            <span className="col"></span>
          </div>
          {multiCtx.shoppingList.map((x) => (
            <ShoppingItem key={x.id} item={x} />
          ))}
        </div>
      </TaxContext.Provider>
    </div>
  );
}
