import { useContext, useState } from "react";
import Button from "../atoms/Button";
import { Context } from "../../Context";
import moment from "moment";

export default function BudgetItem({ item, className = "" }) {
  const multiCtx = useContext(Context);
  const [deleting, setDeleting] = useState(false);
  const [showTxns, setShowTxns] = useState(false);

  return (
    <>
      <div className="between">
        <div
          onClick={() => setShowTxns(!showTxns)}
          style={{
            fontSize: "1.5rem",
            cursor: item.txns.length > 0 ? "pointer" : null,
          }}>
          {item.name}
        </div>
        <div className="d-flex my-auto">
          <div>
            {parseFloat(
              item.txns?.reduce((y, z) => y + Math.abs(z.amount), 0),
            ).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
          <div className="d-flex ms-2">
            {deleting && (
              <Button
                className="red"
                icon="bi:question-lg"
                border={false}
                onClick={() => multiCtx.deleteBudget(item.id)}
              />
            )}
            <Button
              className="red"
              icon="bi:trash2"
              border={false}
              onClick={() => setDeleting(!deleting)}
            />
          </div>
        </div>
      </div>
      {showTxns && item.txns.length > 0 && (
        <div className="px-5 py-2">
          {item.txns.map((x) => (
            <div className="row py-1" style={{ borderBottom: ".5px solid" }}>
              <div className="col-2">
                {parseFloat(x.amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
              <div className="col">{x.merchant}</div>
              <div className="col-1">{moment(x.timestamp).format("M/D")}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
