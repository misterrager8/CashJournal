import { useContext, useEffect, useState } from "react";
import Button from "../atoms/Button";
import { AccountContext } from "../pages/Accounts";
import { api, txnTypes } from "../../util";
import Icon from "../atoms/Icon";
import Dropdown from "../atoms/Dropdown";
import { Context } from "../../Context";
import moment from "moment-timezone";

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

  const [timestamp, setTimestamp] = useState("");
  const onChangeTimestamp = (e) => setTimestamp(e.target.value);

  const [accountType, setAccountType] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (accountCtx.selectedTxn) {
      setAmount(accountCtx.selectedTxn?.amount);
      setMerchant(accountCtx.selectedTxn?.merchant);
      setDescription(accountCtx.selectedTxn?.description);
      setAccountType(accountCtx.selectedTxn?.type_);
      setPending(accountCtx.selectedTxn?.pending);

      setTimestamp(
        moment
          .tz(accountCtx.selectedTxn?.timestamp, "America/New_York")
          .format("YYYY-MM-DD HH:mm:ss"),
      );
      getAccountBalance();
    }
  }, [accountCtx.selectedTxn]);

  const deleteTxn = () => {
    api(
      "delete_txn",
      {
        id: accountCtx.selectedTxn?.id,
        month: accountCtx.currentMonth,
        year: accountCtx.currentYear,
      },
      (data) => {
        accountCtx.setTxns(data.txns);
        accountCtx.setAccounts(data.accounts);
        accountCtx.setSelectedTxn(null);
        setDeleting(false);
      },
    );
  };

  const editTxn = (e) => {
    e.preventDefault();
    api(
      "edit_txn",
      {
        id: accountCtx.selectedTxn?.id,
        merchant: merchant,
        description: description,
        type_: accountType,
        timestamp: timestamp,
        pending: pending,
        amount: amount,
        month: accountCtx.currentMonth,
        year: accountCtx.currentYear,
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

  const switchAccounts = (id) => {
    api(
      "switch_accounts",
      {
        id: accountCtx.selectedTxn?.id,
        newAccount: id,
        month: accountCtx.currentMonth,
        year: accountCtx.currentYear,
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

  const duplicateTxn = () => {
    api(
      "duplicate_txn",
      {
        id: accountCtx.selectedTxn?.id,
        month: accountCtx.currentMonth,
        year: accountCtx.currentYear,
      },
      (data) => {
        accountCtx.setTxns(data.txns);
        accountCtx.setAccounts(data.accounts);
        accountCtx.setSelectedTxn(null);
      },
    );
  };

  const getAccountBalance = () => {
    api(
      "get_balance_at_point",
      {
        id: accountCtx.selectedTxn?.id,
      },
      (data) => {
        setAccountBalance(data.account_balance);
        setNetBalance(data.net_balance);
      },
    );
  };

  const isChanged = () =>
    merchant !== accountCtx.selectedTxn?.merchant ||
    description !== accountCtx.selectedTxn?.description ||
    accountType !== accountCtx.selectedTxn?.type_ ||
    pending !== accountCtx.selectedTxn?.pending ||
    timestamp !==
      moment
        .tz(accountCtx.selectedTxn?.timestamp, "America/New_York")
        .format("YYYY-MM-DD HH:mm:ss");

  return (
    <>
      <div className="between">
        <Button
          size="lg"
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
          <Button
            size="lg"
            border={false}
            icon="bi:arrow-clockwise"
            onClick={() => duplicateTxn()}
          />
          {deleting && (
            <Button
              size="lg"
              border={false}
              className="red"
              icon="bi:question-lg"
              onClick={() => deleteTxn()}
            />
          )}
          <Button
            size="lg"
            border={false}
            className="red"
            icon="bi:trash2"
            onClick={() => setDeleting(!deleting)}
          />
        </div>
      </div>
      <form onSubmit={(e) => editTxn(e)} className="mt-3">
        {isChanged() && (
          <Button
            text="Save Changes"
            icon="bi:plus-lg"
            className="w-100 mb-3"
            type_="submit"
          />
        )}
        <input
          placeholder="0.01"
          // min={0.01}
          type="number"
          step={0.01}
          autoComplete="off"
          value={amount}
          onChange={onChangeAmount}
          className={
            "subtle-input-lg " +
            (pending ? "opacity-50" : amount < 0 ? "red" : "green")
          }
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
            <div className="d-flex my-3">
              <div className="d-flex mx-auto">
                <Icon className="my-auto" name="uit:clock-three" />
                <input
                  max={moment
                    .tz(new Date(), "America/New_York")
                    .format("YYYY-MM-DD")}
                  type="datetime-local"
                  value={timestamp}
                  onChange={onChangeTimestamp}
                  autoComplete="off"
                  className="form-control border-0"
                />
              </div>
            </div>
            <Button
              active={pending}
              className="mb-3"
              border={false}
              text="Pending"
              onClick={() => setPending(!pending)}
              icon={"bi:" + (pending ? "check-square-fill" : "square")}
            />

            <div className="d-flex">
              <div className="mx-auto">
                <Dropdown
                  border={false}
                  text={accountCtx.selectedTxn.accountName}
                  target="switchAccounts"
                  icon="bi:credit-card">
                  {accountCtx.accounts.map((x) => (
                    <a
                      onClick={() => switchAccounts(x.id)}
                      className="dropdown-item">
                      {x.name}
                    </a>
                  ))}
                </Dropdown>

                <div className="mt-2">
                  {parseFloat(accountBalance).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>
                <div className="mt-2">
                  (
                  {parseFloat(netBalance).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                  {" Net"})
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 w-50 mx-auto">
          <div className="d-flex">
            <div className="mx-auto">
              {/* <div
                style={{
                  color: accountCtx.selectedTxn.category?.color,
                }}>
                <Icon
                  name={
                    accountCtx.selectedTxn.category?.icon || "uis:graph-bar"
                  }
                  className="my-auto me-2"
                />
              </div> */}
              <Dropdown
                icon={accountCtx.selectedTxn.category?.icon || "uis:graph-bar"}
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
                    className={
                      "dropdown-item" +
                      (x.id === accountCtx.selectedTxn?.category?.id
                        ? " active"
                        : "")
                    }>
                    <span
                      style={{
                        color: x.color,
                      }}>
                      <Icon
                        className="me-2"
                        name={x?.icon || "uis:graph-bar"}
                      />
                    </span>
                    {x.name}
                  </a>
                ))}
              </Dropdown>

              <Dropdown
                icon={txnTypes.find((x) => x.value === accountType)?.icon}
                border={false}
                classNameBtn="w-100 my-2"
                text={
                  accountType
                    ? accountType.charAt(0).toUpperCase() + accountType.slice(1)
                    : "No Type"
                }
                target="types">
                {txnTypes.map((x) => (
                  <a
                    onClick={() => setAccountType(x.value)}
                    className={
                      "dropdown-item" +
                      (x.value === accountCtx.selectedTxn?.type_
                        ? " active"
                        : "")
                    }>
                    <Icon className={"me-2 " + x.color} name={x.icon} />
                    {x.label}
                  </a>
                ))}
              </Dropdown>
            </div>
          </div>

          <div className="small opacity-50 my-2">Description</div>
          <textarea
            rows={3}
            style={{ resize: "none" }}
            autoComplete="off"
            className="form-control mb-3"
            value={description}
            onChange={onChangeDescription}></textarea>
        </div>
      </form>
    </>
  );
}
