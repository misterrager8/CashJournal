import { useContext, useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { Context } from "../../Context";
import moment from "moment";
import { Icon } from "@iconify/react";
import { AccountContext } from "../pages/Accounts";
import { api } from "../../util";

export default function BillItem({ item, className = "" }) {
  const multiCtx = useContext(Context);
  const accountCtx = useContext(AccountContext);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showTxns, setShowTxns] = useState(false);

  const [name, setName] = useState(item.name);
  const [amount, setAmount] = useState(item.amount);
  const [dayOfMonth, setDayOfMonth] = useState(item.day_of_month);
  const [accountId, setAccountId] = useState(item.accountId);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeAmount = (e) => setAmount(e.target.value);
  const onChangeDayOfMonth = (e) => setDayOfMonth(e.target.value);
  const onChangeAccountId = (e) => setAccountId(e.target.value);

  const datePassed = () => {
    let today = moment().startOf("day");
    let payDate = moment().startOf("day");

    payDate.date(item.day_of_month);

    return payDate < today;
  };

  const addTxn = () => {
    multiCtx.setLoading(true);
    api(
      "add_txn",
      {
        amount: item.amount,
        merchant: item.name,
        id: item.accountId,
        isCharge: true,
        // categoryId: category,
        type_: "expense",
        pending: false,
      },
      (data) => {
        accountCtx.setAccounts(data.accounts);
        accountCtx.setTxns(data.txns);
        multiCtx.setBudgets(data.budgets);
        multiCtx.setLoading(false);
      },
    );
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          multiCtx.editBill(e, item.id, name, amount, dayOfMonth, accountId);
        }}
        className={className + " d-flex mb-1 item"}>
        {editing ? (
          <>
            <Input
              className="me-1"
              onChange={onChangeName}
              value={name}
              placeholder="New Bill"
            />
            <input
              autoComplete="off"
              max={31}
              min={1}
              onChange={onChangeDayOfMonth}
              type="number"
              step={1}
              className="form-control me-1"
              value={dayOfMonth}
            />
            <input
              autoComplete="off"
              onChange={onChangeAmount}
              type="number"
              step={0.01}
              className="form-control me-1"
              value={amount}
            />
            <select
              className="form-control"
              value={accountId}
              onChange={onChangeAccountId}
              required>
              {accountCtx.accounts.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            {datePassed() && (
              <Icon className="my-auto me-2 green" inline icon="bi:check-lg" />
            )}
            <div
              onClick={() => setShowTxns(!showTxns)}
              className="d-flex w-100"
              style={{
                textDecoration: datePassed() ? "line-through" : null,
                opacity: datePassed() ? "50%" : null,
              }}>
              <div className="w-25 fw-bold text-truncate">{name}</div>
              <div className="w-50">
                {moment().format("MMMM")} {dayOfMonth}
              </div>
              <div className="w-25">
                {parseFloat(amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </div>
          </>
        )}
        <Button
          className="green"
          onClick={() => addTxn()}
          border={false}
          icon="bi:plus-lg"
        />
        <Button
          onClick={() => setEditing(!editing)}
          border={false}
          icon="bi:pencil"
        />
        {deleting && (
          <Button
            onClick={() => multiCtx.deleteBill(item.id)}
            className="red"
            border={false}
            icon="bi:question-lg"
          />
        )}
        <Button
          onClick={() => setDeleting(!deleting)}
          className="red"
          border={false}
          icon="bi:x-lg"
        />

        <Button
          className="d-none"
          border={false}
          text="Add Bill"
          icon="bi:plus-lg"
          type_="submit"
        />
      </form>
      {showTxns && item.txns.length > 0 && (
        <div className="pb-4 ps-5">
          {item.txns.map((x) => (
            <div className="row py-1" style={{ borderBottom: ".5px solid" }}>
              <div className="col-3">
                {parseFloat(x.amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
              <div className="col-8">{x.merchant}</div>
              <div className="col-1">{moment(x.timestamp).format("M/D")}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
