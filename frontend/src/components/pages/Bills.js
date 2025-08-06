import { useContext, useEffect } from "react";
import BillItem from "../items/BillItem";
import { MultiContext } from "../../MultiContext";
import NewBill from "../forms/NewBill";
import Calendar from "../Calendar";

export default function Bills() {
  const multiCtx = useContext(MultiContext);

  useEffect(() => {
    multiCtx.getBills();
  }, []);

  return (
    <div>
      <div className="row w-50 m-auto">
        <div className="col">
          <Calendar />
        </div>
        <div className="m-auto text-center col" style={{ fontSize: "4rem" }}>
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
      </div>

      <div className="d-flex my-4">
        <NewBill className="m-auto w-50" />
      </div>

      <div
        className=" border-bottom mt-4"
        style={{ height: "45vh", overflowY: "auto" }}>
        <div className="row border-bottom py-2 fw-bold">
          <span className="col">Merchant</span>
          <span className="col">Day of Month</span>
          <span className="col">Amount</span>
          <span className="col"></span>
        </div>
        {multiCtx.bills.map((x) => (
          <BillItem key={x.id} item={x} />
        ))}
      </div>
    </div>
  );
}
