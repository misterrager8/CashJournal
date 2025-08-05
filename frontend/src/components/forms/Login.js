import { useContext, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import { AuthContext } from "../../AuthContext";

export default function Login({ className = "" }) {
  const authCtx = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  return (
    <form
      onSubmit={(e) => authCtx.login(e, username, password)}
      className={className}>
      <Input
        className="mb-3"
        onChange={onChangeUsername}
        value={username}
        placeholder="Username"
      />
      <Input
        className="mb-3"
        type_="password"
        onChange={onChangePassword}
        value={password}
        placeholder="Password"
      />
      <Button
        className="w-100"
        border={false}
        text="Log In"
        icon="record"
        type_="submit"
      />
    </form>
  );
}
