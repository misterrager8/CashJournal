import { useContext, useEffect, useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { Context } from "../../Context";
import { AccountContext } from "../pages/Accounts";
import Dropdown from "../atoms/Dropdown";
import { api } from "../../util";
import { Icon } from "@iconify/react";

export default function NewTransfer({ className = "" }) {
  const { accounts, selectedAccount, setTxns, setAccounts } =
    useContext(AccountContext);

  const [sourceAccount, setSourceAccount] = useState(null);
  const [destinationAccount, setDestinationAccount] = useState(null);

  const [amount, setAmount] = useState(0.01);
  const onChangeAmount = (e) => setAmount(e.target.value);

  useEffect(() => {
    setSourceAccount(selectedAccount);
    setDestinationAccount(null);
  }, [selectedAccount]);

  const resetAll = () => {
    !selectedAccount && setSourceAccount(null);
    setDestinationAccount(null);
    setAmount(0.01);
  };

  const addTransfer = (e) => {
    e.preventDefault();

    api(
      "add_transfer",
      {
        amount: amount,
        sourceMerchant: sourceAccount?.name,
        sourceId: sourceAccount?.id,
        destMerchant: destinationAccount?.name,
        destId: destinationAccount?.id,
      },
      (data) => {
        setTxns(data.txns);
        setAccounts(data.accounts);
        resetAll();
      },
    );
  };

  return (
    <form onSubmit={(e) => addTransfer(e)} className={"d-flex " + className}>
      <input
        style={{ width: "40px" }}
        onFocus={(e) => e.target.select()}
        placeholder="0.01"
        min={0.01}
        type="number"
        step={0.01}
        autoComplete="off"
        value={amount}
        onChange={onChangeAmount}
        className={"form-control form-control-sm border-0 p-0 me-2"}
      />
      <Dropdown
        icon="bi:credit-card-fill"
        iconColor={sourceAccount?.color}
        active={sourceAccount}
        text={sourceAccount?.name || "Source Account"}
        border={false}
        target="source-account">
        {accounts
          .filter(
            (a) => ![sourceAccount?.id, destinationAccount?.id].includes(a.id),
          )
          .map((x) => (
            <a
              onClick={() => setSourceAccount(x)}
              className={
                "dropdown-item" + (sourceAccount?.id === x.id ? " active" : "")
              }>
              {x.name}
            </a>
          ))}
      </Dropdown>
      <Icon className="my-auto mx-2" icon="bi:arrow-right" inline />
      <Dropdown
        icon="bi:credit-card-fill"
        iconColor={destinationAccount?.color}
        active={destinationAccount}
        text={destinationAccount?.name || "Destination Account"}
        border={false}
        target="destination-account">
        {accounts
          .filter(
            (a) => ![sourceAccount?.id, destinationAccount?.id].includes(a.id),
          )
          .map((x) => (
            <a
              onClick={() => setDestinationAccount(x)}
              className={
                "dropdown-item" +
                (destinationAccount?.id === x.id ? " active" : "")
              }>
              {x.name}
            </a>
          ))}
      </Dropdown>
      {(sourceAccount || destinationAccount) && !selectedAccount && (
        <Button
          className="mx-1 red"
          icon="bi:eraser-fill"
          onClick={() => resetAll()}
        />
      )}
      {sourceAccount && destinationAccount && (
        <Button type_="submit" className="ms-1 green" icon="bi:plus-lg" />
      )}
    </form>
  );
}
