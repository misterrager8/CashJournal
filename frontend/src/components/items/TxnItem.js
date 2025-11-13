import { useContext, useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { api } from "../../util";
import { Context } from "../../Context";
import { AccountContext } from "../pages/Accounts";

export default function TxnItem({ item, className = "" }) {
  const ctx = useContext(Context);
  const accountCtx = useContext(AccountContext);

  const [merchant, setMerchant] = useState(item.merchant);
  const onChangeMerchant = (e) => setMerchant(e.target.value);

  const [amount, setAmount] = useState(item.amount);
  const onChangeAmount = (e) => setAmount(e.target.value);

  const [accountName, setAccountName] = useState(item.accountName);
  const onChangeAccountName = (e) => setAccountName(e.target.value);

  const [timestamp, setTimestamp] = useState(item.timestamp);
  const onChangeTimestamp = (e) => setTimestamp(e.target.value);

  const [deleting, setDeleting] = useState(false);

  const deleteTxn = () => {
    api("delete_txn", { id: item.id }, (data) => {
      accountCtx.setTxns(data.txns);
      accountCtx.setAccounts(data.accounts);
    });
    setDeleting(false);
  };

  return (
    <div className={className + " txn-item"}>
      <Input className="fw-bold" value={merchant} onChange={onChangeMerchant} />
      <input
        type="number"
        step={0.01}
        autoComplete="off"
        value={amount}
        onChange={onChangeAmount}
        className={
          "form-control form-control-sm " + (amount < 0 ? "red" : "green")
        }
      />
      <div className="d-flex w-100 hide-on-mobile">
        <Input value={accountName} onChange={onChangeAccountName} />
        <Input value={timestamp} onChange={onChangeTimestamp} />
      </div>
      {deleting && (
        <Button
          onClick={() => deleteTxn()}
          border={false}
          icon="question-lg"
          className="red"
        />
      )}
      <Button
        onClick={() => setDeleting(!deleting)}
        border={false}
        icon="x-lg"
        className="red"
      />
    </div>
  );
}
