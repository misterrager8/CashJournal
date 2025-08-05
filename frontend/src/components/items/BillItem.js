import { useContext, useState } from "react";
import Button from "../Button";
import { MultiContext } from "../../MultiContext";

export default function BillItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className={className + " item row"}>
      <div className="col">{item.name}</div>
      <div className="col">{item.day_of_month}</div>
      <div className="col">
        {parseFloat(item.amount).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </div>
      <div className="col between">
        <div></div>
        <div>
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
        </div>
      </div>
    </div>
  );
}
