import { useContext, useState } from "react";
import Input from "../atoms/Input";
import { api } from "../../util";
import { AccountContext } from "../pages/Accounts";

export default function NewAccount({ className = "" }) {
  const { setAccounts } = useContext(AccountContext);
  const [name, setName] = useState("");
  const onChangeName = (e) => setName(e.target.value);

  const addAccount = (e) => {
    e.preventDefault();
    api("add_account", { name: name }, (data) => {
      setAccounts(data.accounts);
      setName("");
    });
  };

  return (
    <form
      onSubmit={(e) => addAccount(e)}
      className={className + " input-group"}>
      <Input placeholder="New Account" value={name} onChange={onChangeName} />
    </form>
  );
}
