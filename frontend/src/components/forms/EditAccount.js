import { useContext, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { MultiContext } from "../../MultiContext";
import { AccountContext } from "../pages/Accounts";
import { api } from "../../util";

export default function EditAccount({ className = "" }) {
  const accountCtx = useContext(AccountContext);
  const multiCtx = useContext(MultiContext);

  const [name, setName] = useState(accountCtx.selectedAccount?.name || "");
  const [balance, setBalance] = useState(
    accountCtx.selectedAccount?.balance || 0.01
  );

  const onChangeName = (e) => setName(e.target.value);
  const onChangeBalance = (e) => setBalance(e.target.value);

  const editAccount = (e) => {
    e.preventDefault();
    api(
      "edit_account",
      {
        id: accountCtx.selectedAccount?.id,
        name: name,
        balance: balance,
      },
      (data) => {
        accountCtx.setSelectedAccount(data.account);
        multiCtx.setAccounts(data.accounts);
      }
    );
  };

  return (
    <form onSubmit={(e) => editAccount(e)} className={className + ""}>
      <Input
        className="text-center border-0"
        onChange={onChangeName}
        value={name}
      />
      <input
        style={{ fontSize: "6rem" }}
        autoComplete="off"
        onChange={onChangeBalance}
        type="number"
        step={0.01}
        className="form-control text-center border-0"
        defaultValue={balance}
      />
      <Button className="d-none" icon="plus-lg" type_="submit" />
    </form>
  );
}
