import { useContext, useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { Context } from "../../Context";

export default function Login({ className = "" }) {
  const ctx = useContext(Context);

  const [username, setUsername] = useState("");
  const onChangeUsername = (e) => setUsername(e.target.value);

  const [password, setPassword] = useState("");
  const onChangePassword = (e) => setPassword(e.target.value);

  return (
    <form
      className={className}
      onSubmit={(e) => ctx.login(e, username, password)}>
      <Input
        className="mb-2"
        value={username}
        onChange={onChangeUsername}
        placeholder="Username"
      />
      <Input
        className="mb-2"
        type_="password"
        value={password}
        onChange={onChangePassword}
        placeholder="Password"
      />
      <Button type_="submit" className="mt-3 w-100" text="Log In" />
    </form>
  );
}
