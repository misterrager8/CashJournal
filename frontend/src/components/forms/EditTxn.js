import { useContext, useEffect, useState } from "react";
import Button from "../atoms/Button";
import { AccountContext } from "../pages/Accounts";
import { api } from "../../util";
import Icon from "../atoms/Icon";
import moment from "moment";
import Dropdown from "../atoms/Dropdown";
import { Context } from "../../Context";

export default function EditTxn() {
  const accountCtx = useContext(AccountContext);
  const ctx = useContext(Context);

  const [saved, setSaved] = useState(false);

  const [merchant, setMerchant] = useState("");
  const onChangeMerchant = (e) => setMerchant(e.target.value);

  const [amount, setAmount] = useState(0.0);
  const onChangeAmount = (e) => setAmount(e.target.value);

  const [description, setDescription] = useState("");
  const onChangeDescription = (e) => setDescription(e.target.value);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (accountCtx.selectedTxn) {
      setAmount(accountCtx.selectedTxn?.amount);
      setMerchant(accountCtx.selectedTxn?.merchant);
      setDescription(accountCtx.selectedTxn?.description);
    }
  }, [accountCtx.selectedTxn]);

  const deleteTxn = () => {
    api("delete_txn", { id: accountCtx.selectedTxn?.id }, (data) => {
      accountCtx.setTxns(data.txns);
      accountCtx.setAccounts(data.accounts);
      accountCtx.setSelectedTxn(null);
      setDeleting(false);
    });
  };

  const editTxn = (e) => {
    e.preventDefault();
    api(
      "edit_txn",
      {
        id: accountCtx.selectedTxn?.id,
        merchant: merchant,
        description: description,
      },
      (data) => {
        accountCtx.setTxns(data.txns);
        accountCtx.setAccounts(data.accounts);
        accountCtx.setSelectedTxn(data.txn);
        setSaved(true);
        setTimeout(() => setSaved(false), 1000);
      },
    );
  };

  const isChanged = () =>
    merchant !== accountCtx.selectedTxn?.merchant ||
    description !== accountCtx.selectedTxn?.description;

  return (
    <>
      <div className="between">
        <Button
          border={false}
          icon="bi:arrow-left"
          onClick={() => accountCtx.setSelectedTxn(null)}
        />
        {saved && (
          <div className="small green opacity-50 my-auto">
            <Icon className="me-2" name="bi:check-lg" />
            <span>Saved</span>
          </div>
        )}
        <div className="d-flex">
          {deleting && (
            <Button
              border={false}
              className="red"
              icon="bi:question-lg"
              onClick={() => deleteTxn()}
            />
          )}
          <Button
            border={false}
            className="red"
            icon="bi:trash2"
            onClick={() => setDeleting(!deleting)}
          />
        </div>
      </div>
      <form onSubmit={(e) => editTxn(e)} className="mt-3">
        <input
          placeholder="0.01"
          // min={0.01}
          type="number"
          step={0.01}
          autoComplete="off"
          value={amount}
          onChange={onChangeAmount}
          className={"subtle-input-lg " + (amount < 0 ? "red" : "green")}
        />
        <input
          step={0.01}
          autoComplete="off"
          value={merchant}
          onChange={onChangeMerchant}
          className="subtle-input"
        />
        <div className="mt-3">
          <div className="text-center" style={{ fontSize: "1.1rem" }}>
            <div className="mb-2">
              <Icon className="" name="bi:clock-history" />
              <div className="">
                {moment(accountCtx.selectedTxn.timestamp).format("LLLL")}
              </div>
            </div>
            <div className="">
              <Icon className="" name="bi:credit-card" />
              <div className="">{accountCtx.selectedTxn.accountName}</div>
            </div>
          </div>
        </div>
        <div className="mt-3 w-50 mx-auto">
          <Dropdown
            border={false}
            classNameBtn="w-100"
            text={
              accountCtx.selectedTxn.category?.id
                ? accountCtx.selectedTxn.category?.name
                : "No Budget"
            }
            target="budgets">
            <a
              onClick={() => accountCtx.switchBudget(null)}
              className="dropdown-item">
              No Budget
            </a>
            {ctx.budgets.map((x) => (
              <a
                onClick={() => accountCtx.switchBudget(x.id)}
                className="dropdown-item">
                {x.name}
              </a>
            ))}
          </Dropdown>
          <div className="small opacity-50 my-2">Description</div>
          <textarea
            rows={6}
            style={{ resize: "none" }}
            autoComplete="off"
            className="form-control mb-3"
            value={description}
            onChange={onChangeDescription}></textarea>
          <div className={isChanged() ? "" : "invisible"}>
            <Button
              text="Save Changes"
              icon="bi:plus-lg"
              className="w-100"
              type_="submit"
            />
          </div>
        </div>
      </form>
    </>
  );
}
