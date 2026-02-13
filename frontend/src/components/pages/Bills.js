import { useContext, useEffect } from "react";
import BillItem from "../items/BillItem";
import NewBill from "../forms/NewBill";
import Calendar from "../Calendar";
import { Context } from "../../Context";

export default function Bills() {
  const multiCtx = useContext(Context);

  useEffect(() => {
    multiCtx.getBills();
  }, []);

  return (
    <div className="flex">
      <div className="col-33">
        <Calendar />
      </div>
      <div className="divider"></div>
      <div className="col-67">
        <div className="m text-center " style={{ fontSize: "4rem" }}>
          <div className="h3">Total</div>
          <div>
            {parseFloat(
              multiCtx.bills.reduce((x, y) => x + parseFloat(y.amount), 0)
            ).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </div>
        <NewBill className="my-4" />
        <div className="bills-scroll">
          {multiCtx.bills.map((x) => (
            <BillItem key={x.id} item={x} />
          ))}
        </div>
      </div>
    </div>
  );
}
