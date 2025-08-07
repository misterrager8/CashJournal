import { useContext, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { MultiContext } from "../../MultiContext";
import { api } from "../../util";

export default function TxnItem({ item, className = "" }) {
  const multiCtx = useContext(MultiContext);
  const [deleting, setDeleting] = useState(false);

  const [amount, setAmount] = useState(item.amount);
  const [merchant, setMerchant] = useState(item.merchant);
  const [accountId, setAccountId] = useState(item.accountId);
  const [timestamp, setTimestamp] = useState(item.timestamp);

  const onChangeAmount = (e) => setAmount(e.target.value);
  const onChangeMerchant = (e) => setMerchant(e.target.value);
  const onChangeAccountId = (e) => setAccountId(e.target.value);
  const onChangeTimestamp = (e) => setTimestamp(e.target.value);

  const deleteTxn = () => {
    api("delete_txn", { id: item.id }, (data) => {
      multiCtx.setTxns(data.txns);
      multiCtx.setAccounts(data.accounts);
    });
    setDeleting(false);
  };

  const editTxn = (e) => {
    e.preventDefault();
    api(
      "edit_txn",
      { id: item.id, amount: amount, merchant: merchant, timestamp: timestamp },
      (data) => {
        multiCtx.setAccounts(data.accounts);
        multiCtx.setTxns(data.txns);
      }
    );
    setDeleting(false);
  };

  return (
    <form onSubmit={(e) => editTxn(e)} className={className + " item d-flex my-1"}>
      <Input
        className="border-0 me-1"
        onChange={onChangeMerchant}
        value={merchant}
        placeholder="Merchant Name"
      />
      <input
        autoComplete="off"
        onChange={onChangeAmount}
        type="number"
        step={0.01}
        className={
          "form-control border-0 me-1" +
          (parseFloat(amount) < 0 ? " red-text" : " green-text")
        }
        value={amount}
      />
      <select
        className="form-control border-0 me-1"
        value={accountId}
        onChange={onChangeAccountId}
        required>
        {multiCtx.accounts.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
      <input
        onChange={onChangeTimestamp}
        className="form-control border-0"
        type="datetime-local"
        value={timestamp}
      />
      {deleting && (
        <Button
          className="red"
          onClick={() => deleteTxn()}
          border={false}
          icon="question-lg"
        />
      )}
      <Button
        className="red"
        onClick={() => setDeleting(!deleting)}
        border={false}
        icon="x-lg"
      />
      <Button className="d-none" icon="plus-lg" type_="submit" />
    </form>
  );
}
